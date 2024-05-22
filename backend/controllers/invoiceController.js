const prisma = require("../common/prismaClient");

async function createInvoice(req, res) {
    const { invoiceNumber, clientName, items, totalAmount, dueDate } = req.body;

    if (!invoiceNumber) {
        return res.status(400).json({ message: 'Invoice number is required' });
    }

    if (!clientName) {
        return res.status(400).json({ message: 'Client name is required' });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'At least one item is required' });
    }

    if (!totalAmount) {
        return res.status(400).json({ message: 'Total amount is required' });
    }

    if (!dueDate) {
        return res.status(400).json({ message: 'Due date is required' });
    }

    try {
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                clientName,
                totalAmount,
                dueDate: new Date(dueDate),
                user: { connect: { id: req.userId } },
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            }
        });
        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getAllInvoices(req, res) {
    try {
        let invoices;
        if (req.userRole === 'ADMIN') {
            invoices = await prisma.invoice.findMany({
                include: {
                    items: true,
                    user: true
                }
            });
        } else {
            invoices = await prisma.invoice.findMany({
                where: {
                    userId: req.userId
                },
                include: {
                    items: true
                }
            });
        }

        if (!invoices || invoices.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getInvoiceById(req, res) {
    const { id } = req.params;

    try {
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                items: true,
                user: true // Include the user who owns the invoice
            }
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Check if the authenticated user is the owner of the invoice
        if (req.userRole !== 'ADMIN' && invoice.userId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateInvoice(req, res) {
    const { id } = req.params;

    try {
        await prisma.$transaction(async (prismaClient) => {
            // Retrieve existing invoice data
            const existingInvoice = await prismaClient.invoice.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    items: true
                }
            });

            if (!existingInvoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }

            // Check if the authenticated user is the owner of the invoice
            if (req.userRole !== 'ADMIN' && existingInvoice.userId !== req.userId) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Extract update data from request body
            const { invoiceNumber, clientName, items, totalAmount, dueDate } = req.body;

            // Update the invoice data
            await prismaClient.invoice.update({
                where: { id: Number(id) },
                data: {
                    invoiceNumber: invoiceNumber || existingInvoice.invoiceNumber,
                    clientName: clientName || existingInvoice.clientName,
                    totalAmount: totalAmount || existingInvoice.totalAmount,
                    dueDate: dueDate ? new Date(dueDate) : existingInvoice.dueDate,
                }
            });

            // Update or create new items
            await Promise.all(items.map(async item => {
                if (item.id) {
                    await prismaClient.item.update({
                        where: { id: item.id },
                        data: item
                    });
                } else {
                    await prismaClient.item.create({
                        data: { ...item, invoiceId: Number(id) }
                    });
                }
            }));
        });

        // Fetch the updated invoice to include the items
        const updatedInvoice = await prisma.invoice.findUnique({
            where: { id: Number(id) },
            include: { items: true }
        });

        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




async function deleteInvoice(req, res) {
    const { id } = req.params;

    try {
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                items: true // Include associated items
            }
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Check if the authenticated user is the owner of the invoice
        if (req.userRole !== 'ADMIN' && invoice.userId !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Proceed with deleting the associated items first
        await prisma.item.deleteMany({
            where: { invoiceId: Number(id) }
        });

        // Then delete the invoice
        await prisma.invoice.delete({
            where: { id: Number(id) }
        });

        res.status(204).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
