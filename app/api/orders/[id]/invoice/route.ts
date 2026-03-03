/**
 * API Route pour générer une facture PDF pour une commande
 */

import { NextResponse } from "next/server"
import { getOrderById } from "@/lib/services/orders"
import { customerRepository } from "@/lib/repositories"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Récupérer la commande avec toutes ses relations
    const order = await getOrderById(id)
    
    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      )
    }

    // Récupérer le client
    const customer = await customerRepository.findById(order.customerId)
    
    if (!customer) {
      return NextResponse.json(
        { error: "Client introuvable" },
        { status: 404 }
      )
    }

    // Générer le HTML de la facture
    const invoiceHTML = generateInvoiceHTML(order, customer)

    // Retourner le HTML (pour l'instant, on retourne le HTML)
    // Plus tard, on pourra utiliser une bibliothèque comme puppeteer ou jsPDF pour générer un PDF
    return new NextResponse(invoiceHTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="facture-${order.orderNumber}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la génération de la facture" },
      { status: 500 }
    )
  }
}

function generateInvoiceHTML(order: any, customer: any): string {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${order.orderNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #C19A6B;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #C19A6B;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #1a1a1a;
    }
    .invoice-info p {
      color: #666;
      margin: 5px 0;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 16px;
      margin-bottom: 15px;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section p {
      margin: 5px 0;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    thead {
      background: #f5f5f5;
    }
    th {
      text-align: left;
      padding: 12px;
      font-weight: 600;
      color: #1a1a1a;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .totals-row.total {
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid #C19A6B;
      border-bottom: 2px solid #C19A6B;
      padding-top: 15px;
      padding-bottom: 15px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">TONOMI</div>
        <p style="margin-top: 10px; color: #666;">Accessoires de qualité</p>
      </div>
      <div class="invoice-info">
        <h1>FACTURE</h1>
        <p><strong>N° ${order.orderNumber}</strong></p>
        <p>Date: ${invoiceDate}</p>
      </div>
    </div>

    <div class="details">
      <div class="section">
        <h2>Facturé à</h2>
        <p><strong>${customer.firstName} ${customer.lastName}</strong></p>
        <p>${customer.email}</p>
        ${customer.phone ? `<p>${customer.phone}</p>` : ""}
        <p style="margin-top: 15px;">
          ${order.billingAddress.street}<br>
          ${order.billingAddress.zipCode} ${order.billingAddress.city}<br>
          ${order.billingAddress.country}
        </p>
      </div>
      <div class="section">
        <h2>Livré à</h2>
        <p><strong>${customer.firstName} ${customer.lastName}</strong></p>
        <p style="margin-top: 15px;">
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.zipCode} ${order.shippingAddress.city}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Article</th>
          <th class="text-right">Quantité</th>
          <th class="text-right">Prix unitaire</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item: any) => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              ${item.color || item.size ? `<br><small style="color: #666;">${item.color || ""} ${item.size ? `| ${item.size}` : ""}</small>` : ""}
            </td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${formatPrice(item.price)}</td>
            <td class="text-right"><strong>${formatPrice(item.price * item.quantity)}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Sous-total</span>
        <span>${formatPrice(order.subtotal)}</span>
      </div>
      ${order.discount > 0 ? `
        <div class="totals-row" style="color: #10b981;">
          <span>Remise</span>
          <span>-${formatPrice(order.discount)}</span>
        </div>
      ` : ""}
      <div class="totals-row">
        <span>Livraison</span>
        <span>${order.shipping === 0 ? "Gratuite" : formatPrice(order.shipping)}</span>
      </div>
      ${order.tax > 0 ? `
        <div class="totals-row">
          <span>TVA</span>
          <span>${formatPrice(order.tax)}</span>
        </div>
      ` : ""}
      <div class="totals-row total">
        <span>TOTAL</span>
        <span>${formatPrice(order.total)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Merci pour votre achat !</p>
      <p style="margin-top: 10px;">Pour toute question, contactez-nous à support@tonomi.com</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}
