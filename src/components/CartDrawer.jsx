import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Check, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LICENSE_TIERS } from '../data/fontsData';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
  onUpdateCartItemLicense
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: 'Rafiqul Islam',
    email: 'rafiqul@designstudio.io',
    company: 'Studio Akshar & Co.'
  });

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cart.reduce((acc, item) => {
    const tier = LICENSE_TIERS.find(t => t.id === (item.selectedLicenseTier || 'commercial')) || LICENSE_TIERS[0];
    const price = item.isFree ? 0 : Math.round(item.price * (tier.multiplier || 1));
    return acc + price;
  }, 0);

  const discountAmount = Math.round(subtotal * appliedDiscount);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TYPO2026' || promoCode.trim().toUpperCase() === 'AKSHAR') {
      setAppliedDiscount(0.2); // 20% off
      setPromoMessage('Promo code applied: 20% Foundry discount active!');
    } else {
      setPromoMessage('Invalid promo code. Try "TYPO2026"');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsCheckingOut(false);
    setOrderComplete(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }
  };

  const downloadLicenseCertificate = () => {
    const certText = `
========================================================================
AKSHAR TYPE FOUNDRY — OFFICIAL DIGITAL TYPOGRAPHY LICENSE CERTIFICATE
========================================================================
Order Reference: AKS-${Math.floor(100000 + Math.random() * 900000)}
Issue Date: ${new Date().toLocaleDateString()}
Licensee Name: ${buyerInfo.name}
Organization / Studio: ${buyerInfo.company}
Contact: ${buyerInfo.email}

LICENSED TYPEFACES:
${cart.map((item, idx) => `
${idx + 1}. Typeface: ${item.name} (${item.banglaName || item.category})
   Tier Granted: ${(item.selectedLicenseTier || 'commercial').toUpperCase()} LICENSE
   Format: OpenType / TrueType (.otf, .ttf)
   Grant Scope: Desktop Publishing, Web Embedding, Digital Video, Branding
`).join('\n')}

FOUNDRY TERMS & WARRANTIES:
1. Akshar Type Foundry grants the licensee non-exclusive, worldwide rights
   governed under the selected tier terms.
2. The font software is licensed, not sold.
3. Modification, decompilation, and unauthorized resale of font binaries are prohibited.

Authorized by:
Akshar Type Foundry Directorate
https://akshar-type.foundry
========================================================================
    `.trim();

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AKSHAR_License_Certificate_${buyerInfo.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" style={{ maxWidth: '480px' }}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={18} color="var(--accent-vermilion)" />
            <span>Typeface Cart ({cart.length})</span>
          </div>
          <button className="mini-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {orderComplete ? (
            /* Order Success State */
            <div className="order-success-banner" style={{ padding: '2rem 0' }}>
              <div className="success-check-icon">
                <Check size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                Licensing Confirmed!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                Thank you for acquiring fonts from Akshar Type Foundry. Your commercial rights are now officially registered.
              </p>

              <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  DOWNLOAD YOUR TYPEFACES:
                </span>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                    <a
                      href={item.styles?.[0]?.file || item.file}
                      download={`${item.name}.ttf`}
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Download size={13} />
                      <span>Download TTF</span>
                    </a>
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.85rem' }}
                onClick={downloadLicenseCertificate}
              >
                <FileText size={16} />
                <span>Download Official License Certificate</span>
              </button>

              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => {
                  onClearCart();
                  setOrderComplete(false);
                  onClose();
                }}
              >
                <span>Done & Return to Catalog</span>
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form Modal */
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CreditCard size={18} color="var(--accent-vermilion)" />
                <h4 style={{ fontWeight: 800 }}>Foundry Licensee Information</h4>
              </div>

              <div className="control-group">
                <span className="control-group-title">FULL NAME / LICENSEE</span>
                <input
                  type="text"
                  required
                  className="preview-input"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                />
              </div>

              <div className="control-group">
                <span className="control-group-title">ORGANIZATION / STUDIO</span>
                <input
                  type="text"
                  required
                  className="preview-input"
                  value={buyerInfo.company}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, company: e.target.value })}
                />
              </div>

              <div className="control-group">
                <span className="control-group-title">EMAIL (DELIVERY & INVOICE)</span>
                <input
                  type="email"
                  required
                  className="preview-input"
                  value={buyerInfo.email}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                />
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Total Amount Due:</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-vermilion)', fontSize: '1.2rem' }}>
                    ${total}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="var(--accent-emerald)" />
                  <span>Includes lifetime commercial usage rights & updates.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setIsCheckingOut(false)}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1.5, justifyContent: 'center', padding: '0.75rem' }}
                >
                  <Check size={16} />
                  <span>Confirm & Issue License (${total})</span>
                </button>
              </div>
            </form>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Your cart is empty.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Browse our type library and add fonts to acquire commercial licenses or download them.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map((item) => {
                  const currentTierId = item.selectedLicenseTier || 'commercial';
                  const tier = LICENSE_TIERS.find(t => t.id === currentTierId) || LICENSE_TIERS[0];
                  const itemPrice = item.isFree ? 0 : Math.round(item.price * (tier.multiplier || 1));

                  return (
                    <div key={item.id} className="cart-item-card">
                      <div className="cart-item-row">
                        <div>
                          <h4 className="cart-item-name">{item.name}</h4>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.category} • {item.foundry || 'Akshar Archive'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className="cart-item-price">
                            {item.isFree ? 'Free' : `$${itemPrice}`}
                          </span>
                          <button
                            className="mini-icon-btn"
                            onClick={() => onRemoveFromCart(item.id)}
                            title="Remove from cart"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* License Tier Selector */}
                      {!item.isFree && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            LICENSE TIER:
                          </span>
                          <select
                            className="sort-select"
                            style={{ width: '100%', height: '32px' }}
                            value={currentTierId}
                            onChange={(e) => onUpdateCartItemLicense(item.id, e.target.value)}
                          >
                            {LICENSE_TIERS.map((lt) => (
                              <option key={lt.id} value={lt.id}>
                                {lt.name} (${Math.round(item.price * lt.multiplier)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Box */}
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Discount code (e.g. TYPO2026)"
                  className="preview-input"
                  style={{ height: '38px', textTransform: 'uppercase' }}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="btn-secondary" onClick={handleApplyPromo} style={{ height: '38px' }}>
                  Apply
                </button>
              </div>

              {promoMessage && (
                <div style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: appliedDiscount > 0 ? 'var(--accent-emerald)' : 'var(--accent-vermilion)',
                  marginTop: '0.35rem'
                }}>
                  {promoMessage}
                </div>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && !isCheckingOut && !orderComplete && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                  <span>Discount (20%):</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                <span>Total:</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-vermilion)' }}>
                  ${total}
                </span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              onClick={() => setIsCheckingOut(true)}
            >
              <ShieldCheck size={18} />
              <span>Proceed to Foundry Checkout (${total})</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
