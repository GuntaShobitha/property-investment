/**
 * STACKLY PROPERTY INVESTMENT — USER DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Demo Properties Database
  const defaultProperties = [
    {
      id: 'PROP-01',
      title: 'The Aurum Penthouse - Mayfair',
      category: 'Residential',
      location: 'London, W1K',
      indicativePrice: 12500000,
      minInvestment: 50000,
      projectedYield: '8.4%',
      holdingPeriod: '3 - 5 Years',
      status: 'Active',
      image: './images/property-1.webp',
      saved: true,
      description: 'Ultra-prime Mayfair residential penthouse overlooking Grosvenor Square with private terraces and concierge service.'
    },
    {
      id: 'PROP-02',
      title: 'Kensington Garden Residences',
      category: 'Residential',
      location: 'London, W8',
      indicativePrice: 8900000,
      minInvestment: 35000,
      projectedYield: '7.8%',
      holdingPeriod: '4 - 6 Years',
      status: 'Active',
      image: './images/property-2.webp',
      saved: false,
      description: 'Exclusive heritage apartment block adjacent to Kensington Gardens offering high rental yields and long-term capital preservation.'
    },
    {
      id: 'PROP-03',
      title: 'Grandview Financial Plaza',
      category: 'Commercial',
      location: 'Frankfurt, CBD',
      indicativePrice: 34000000,
      minInvestment: 100000,
      projectedYield: '9.2%',
      holdingPeriod: '5 - 7 Years',
      status: 'Active',
      image: './images/property-3.webp',
      saved: true,
      description: 'Grade-A financial district office tower fully leased to institutional banking tenants with 12-year average lease length.'
    },
    {
      id: 'PROP-04',
      title: 'Azure Coastfront Villas',
      category: 'Rental',
      location: 'Côte d’Azur, France',
      indicativePrice: 16500000,
      minInvestment: 40000,
      projectedYield: '10.5%',
      holdingPeriod: '3 - 5 Years',
      status: 'Active',
      image: './images/property-4.webp',
      saved: false,
      description: 'Turnkey luxury coastal rental estate portfolio managed by leading hospitality operators with guaranteed seasonal yields.'
    },
    {
      id: 'PROP-05',
      title: 'Belgravia Heritage Townhomes',
      category: 'Residential',
      location: 'London, SW1X',
      indicativePrice: 21000000,
      minInvestment: 75000,
      projectedYield: '7.2%',
      holdingPeriod: '5 - 8 Years',
      status: 'Active',
      image: './images/property-5.webp',
      saved: false,
      description: 'Restored Georgian townhomes in prime Belgravia combining historic architecture with sustainable geothermal heating.'
    },
    {
      id: 'PROP-06',
      title: 'Skyline Mixed-Use Tower',
      category: 'Mixed-Use',
      location: 'Zurich, Switzerland',
      indicativePrice: 42000000,
      minInvestment: 150000,
      projectedYield: '8.9%',
      holdingPeriod: '5 - 10 Years',
      status: 'Active',
      image: './images/property-6.webp',
      saved: false,
      description: 'Next-generation urban hub combining luxury corporate suites, boutique retail, and serviced executive suites.'
    }
  ];

  // Initialize state
  let properties = getStoredData('properties', defaultProperties);

  // Demo User Portfolio State
  const defaultInvestments = [
    { id: 'INV-8821', property: 'The Aurum Penthouse - Mayfair', date: '2026-03-15', amount: 150000, status: 'Active', yield: '8.4%', returns: 12600 },
    { id: 'INV-7649', property: 'Grandview Financial Plaza', date: '2026-01-20', amount: 250000, status: 'Active', yield: '9.2%', returns: 23000 },
    { id: 'INV-6512', property: 'Kensington Garden Residences', date: '2025-11-10', amount: 75000, status: 'Active', yield: '7.8%', returns: 5850 }
  ];

  const defaultTransactions = [
    { id: 'TX-901', date: '2026-10-01', description: 'Quarterly Rental Distribution — Aurum Penthouse', type: 'Income', amount: 3150, status: 'Completed' },
    { id: 'TX-874', date: '2026-09-15', description: 'Quarterly Commercial Dividend — Financial Plaza', type: 'Income', amount: 5750, status: 'Completed' },
    { id: 'TX-812', date: '2026-03-15', description: 'Co-Investment Allocation — INV-8821', type: 'Capital', amount: -150000, status: 'Completed' },
    { id: 'TX-755', date: '2026-01-20', description: 'Co-Investment Allocation — INV-7649', type: 'Capital', amount: -250000, status: 'Completed' },
    { id: 'TX-701', date: '2025-11-10', description: 'Co-Investment Allocation — INV-6512', type: 'Capital', amount: -75000, status: 'Completed' }
  ];

  let investments = getStoredData('user_investments', defaultInvestments);
  let transactions = getStoredData('user_transactions', defaultTransactions);

  // 1. Navigation / View Switcher (12 Views)
  const navButtons = document.querySelectorAll('.dash-nav-btn');
  const viewSections = document.querySelectorAll('.dash-view-section');
  const breadcrumbEl = document.querySelector('.dash-breadcrumbs');

  function switchView(targetViewId) {
    // Hide all views
    viewSections.forEach(sec => sec.classList.remove('active'));

    // Deactivate all buttons
    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === targetViewId) {
        btn.classList.add('active');
        if (breadcrumbEl) {
          const viewTitle = btn.textContent.trim().replace(/[0-9]/g, '');
          breadcrumbEl.textContent = `Investor Portal / ${viewTitle}`;
        }
      }
    });

    const activeSec = document.getElementById(`view-${targetViewId}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Close mobile drawer if open
    const sidebar = document.querySelector('.dash-sidebar');
    if (sidebar) sidebar.classList.remove('drawer-open');

    // Trigger re-renders
    if (targetViewId === 'opportunities') renderOpportunities();
    if (targetViewId === 'saved') renderSavedProperties();
    if (targetViewId === 'transactions') renderTransactionsTable();
    if (targetViewId === 'investments') renderInvestmentsTable();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view');
      if (viewId === 'logout') {
        showToast('Logging out of STACKLY Investor Portal...', 'info');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 600);
        return;
      }
      switchView(viewId);
    });
  });

  // Mobile Sidebar Drawer Toggle
  const toggleBtn = document.querySelector('.dash-sidebar-toggle-btn');
  const sidebar = document.querySelector('.dash-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('drawer-open');
    });
  }

  // 2. Render Investment Opportunities
  const oppsContainer = document.getElementById('oppsGrid');
  const oppsSearch = document.getElementById('oppsSearchInput');
  const oppsCategoryFilter = document.getElementById('oppsCategoryFilter');

  function renderOpportunities() {
    if (!oppsContainer) return;

    const searchTerm = oppsSearch ? oppsSearch.value.toLowerCase().trim() : '';
    const selectedCategory = oppsCategoryFilter ? oppsCategoryFilter.value : 'All';

    const filtered = properties.filter(prop => {
      const matchSearch = prop.title.toLowerCase().includes(searchTerm) || prop.location.toLowerCase().includes(searchTerm);
      const matchCat = selectedCategory === 'All' || prop.category === selectedCategory;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      oppsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--color-muted);">search_off</span>
          <h4 style="margin: 0.8rem 0 0.4rem;">No matching investment opportunities</h4>
          <p class="text-muted">Try clearing your search query or selecting another category.</p>
        </div>
      `;
      return;
    }

    oppsContainer.innerHTML = filtered.map(prop => `
      <div class="property-card">
        <div class="property-image-wrap">
          <img src="${prop.image}" alt="${prop.title}" class="property-image" loading="lazy">
          <span class="property-badge">${prop.category}</span>
          <span class="property-status">${prop.status}</span>
        </div>
        <div class="property-body">
          <div class="property-location">
            <span class="material-symbols-outlined">location_on</span>
            ${prop.location}
          </div>
          <h3 class="property-title">${prop.title}</h3>
          
          <div class="property-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Est. Yield</span>
              <span class="meta-value">${prop.projectedYield}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Term</span>
              <span class="meta-value">${prop.holdingPeriod}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Min. Entry</span>
              <span class="meta-value">${formatCurrency(prop.minInvestment)}</span>
            </div>
          </div>

          <div class="property-footer">
            <div class="property-indicative-price">
              Indicative Asset Value
              <strong>${formatCurrency(prop.indicativePrice)}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline btn-sm toggle-save-btn" data-id="${prop.id}" title="${prop.saved ? 'Unsave Property' : 'Save Property'}">
                <span class="material-symbols-outlined" style="color: ${prop.saved ? '#F5B740' : 'inherit'}; font-size: 1.15rem;">
                  ${prop.saved ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
              <button class="btn btn-primary btn-sm view-prop-detail-btn" data-id="${prop.id}">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Save/Unsave event listeners
    oppsContainer.querySelectorAll('.toggle-save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.getAttribute('data-id');
        toggleSaveProperty(propId);
      });
    });

    // Attach Details event listeners
    oppsContainer.querySelectorAll('.view-prop-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.getAttribute('data-id');
        showPropertyDetailModal(propId);
      });
    });
  }

  if (oppsSearch) oppsSearch.addEventListener('input', renderOpportunities);
  if (oppsCategoryFilter) oppsCategoryFilter.addEventListener('change', renderOpportunities);

  // Toggle Save Property
  function toggleSaveProperty(propId) {
    const prop = properties.find(p => p.id === propId);
    if (prop) {
      prop.saved = !prop.saved;
      setStoredData('properties', properties);
      showToast(prop.saved ? `Saved ${prop.title} to your watchlist.` : `Removed ${prop.title} from your watchlist.`, 'info');
      renderOpportunities();
      renderSavedProperties();
      updateSavedCount();
    }
  }

  function updateSavedCount() {
    const savedCount = properties.filter(p => p.saved).length;
    const badge = document.querySelector('.dash-nav-badge.saved-count');
    if (badge) badge.textContent = savedCount;
  }
  updateSavedCount();

  // 3. Render Saved Properties View
  const savedContainer = document.getElementById('savedGrid');
  function renderSavedProperties() {
    if (!savedContainer) return;
    const savedList = properties.filter(p => p.saved);

    if (savedList.length === 0) {
      savedContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--color-muted);">bookmark_border</span>
          <h4 style="margin: 0.8rem 0 0.4rem;">No saved properties in your watchlist</h4>
          <p class="text-muted">Browse investment opportunities and click the bookmark icon to save opportunities here.</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="document.querySelector('[data-view=\\'opportunities\\']').click()">
            Explore Opportunities
          </button>
        </div>
      `;
      return;
    }

    savedContainer.innerHTML = savedList.map(prop => `
      <div class="property-card">
        <div class="property-image-wrap">
          <img src="${prop.image}" alt="${prop.title}" class="property-image" loading="lazy">
          <span class="property-badge">${prop.category}</span>
        </div>
        <div class="property-body">
          <div class="property-location"><span class="material-symbols-outlined">location_on</span> ${prop.location}</div>
          <h3 class="property-title">${prop.title}</h3>
          <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 1rem;">${prop.description}</p>
          <div class="property-footer">
            <div class="property-indicative-price">
              Indicative Asset
              <strong>${formatCurrency(prop.indicativePrice)}</strong>
            </div>
            <button class="btn btn-outline btn-sm toggle-save-btn" data-id="${prop.id}">
              <span class="material-symbols-outlined" style="font-size: 1.1rem; color: #F5B740;">bookmark</span> Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');

    savedContainer.querySelectorAll('.toggle-save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleSaveProperty(btn.getAttribute('data-id'));
      });
    });
  }

  // 4. Property Detail Modal
  function showPropertyDetailModal(propId) {
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    const modalBody = document.getElementById('propModalBody');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem; border-radius: var(--radius-xs); overflow: hidden; max-height: 280px;">
          <img src="${prop.image}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <span class="eyebrow" style="margin-bottom: 0.3rem;">${prop.category}</span>
            <h3 style="font-size: 1.8rem; margin-bottom: 0.2rem;">${prop.title}</h3>
            <div style="font-size: 0.9rem; color: var(--color-muted); display: flex; align-items: center; gap: 0.3rem;">
              <span class="material-symbols-outlined" style="font-size: 1.1rem; color: var(--accent-gold-dark);">location_on</span>
              ${prop.location}
            </div>
          </div>
          <span class="dash-status-pill status-active">${prop.status}</span>
        </div>
        <p style="color: var(--color-body); line-height: 1.7; margin-bottom: 1.5rem;">${prop.description}</p>
        
        <div class="dash-stat-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1.5rem;">
          <div class="dash-stat-card" style="padding: 1.2rem;">
            <div class="dash-stat-label">Projected Yield</div>
            <div class="dash-stat-val" style="font-size: 1.6rem; color: #208850;">${prop.projectedYield}</div>
          </div>
          <div class="dash-stat-card" style="padding: 1.2rem;">
            <div class="dash-stat-label">Min. Allocation</div>
            <div class="dash-stat-val" style="font-size: 1.6rem;">${formatCurrency(prop.minInvestment)}</div>
          </div>
          <div class="dash-stat-card" style="padding: 1.2rem;">
            <div class="dash-stat-label">Asset Valuation</div>
            <div class="dash-stat-val" style="font-size: 1.6rem;">${formatCurrency(prop.indicativePrice)}</div>
          </div>
        </div>

        <div class="demo-data-banner">
          <span class="material-symbols-outlined">info</span>
          <div>Illustrative demo opportunity. In production, institutional offering documents and audited appraisal dossiers are provided.</div>
        </div>
      `;
      Modal.open('propDetailModal');
    }
  }

  // 5. Transactions Table & CSV Export
  const txTableBody = document.getElementById('txTableBody');
  const exportTxBtn = document.getElementById('exportTxBtn');

  function renderTransactionsTable() {
    if (!txTableBody) return;
    txTableBody.innerHTML = transactions.map(tx => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${tx.id}</td>
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td><span class="dash-status-pill status-active">${tx.type}</span></td>
        <td style="font-weight: 600; color: ${tx.amount > 0 ? '#208850' : 'var(--color-heading)'};">
          ${tx.amount > 0 ? '+' : ''}${formatCurrency(tx.amount)}
        </td>
        <td><span class="dash-status-pill status-completed">${tx.status}</span></td>
      </tr>
    `).join('');
  }

  if (exportTxBtn) {
    exportTxBtn.addEventListener('click', () => {
      const headers = ['Transaction ID', 'Date', 'Description', 'Type', 'Amount (USD)', 'Status'];
      const rows = transactions.map(tx => [tx.id, tx.date, tx.description, tx.type, tx.amount, tx.status]);
      exportToCSV('STACKLY_Transactions', rows, headers);
    });
  }

  // 6. Investments Table
  const invTableBody = document.getElementById('invTableBody');
  function renderInvestmentsTable() {
    if (!invTableBody) return;
    invTableBody.innerHTML = investments.map(inv => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${inv.id}</td>
        <td style="font-weight: 600;">${inv.property}</td>
        <td>${inv.date}</td>
        <td>${formatCurrency(inv.amount)}</td>
        <td style="color: #208850; font-weight: 600;">${inv.yield}</td>
        <td style="font-weight: 600; color: #208850;">+${formatCurrency(inv.returns)}</td>
        <td><span class="dash-status-pill status-active">${inv.status}</span></td>
      </tr>
    `).join('');
  }

  // 7. Interactive Time Filter Pills on Returns Chart
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const period = pill.getAttribute('data-period');
      showToast(`Refreshed performance analytics for period: ${period}`, 'info');
      animatePerformancePath();
    });
  });

  function animatePerformancePath() {
    const path = document.getElementById('perfChartPath');
    if (path) {
      path.style.transition = 'stroke-dashoffset 0.8s ease-in-out';
      path.style.strokeDashoffset = '100';
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, 50);
    }
  }

  // 8. Notifications: Mark All as Read
  const markReadBtn = document.getElementById('markAllReadBtn');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
        item.classList.add('read');
      });
      const badge = document.querySelector('.dash-nav-badge.notif-count');
      if (badge) badge.style.display = 'none';
      const indicator = document.querySelector('.notification-indicator');
      if (indicator) indicator.style.display = 'none';
      showToast('All notifications marked as read', 'success');
    });
  }

  // 9. Client-side Support Ticket Form
  const ticketForm = document.getElementById('supportTicketForm');
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('ticketSubject');
      const msg = document.getElementById('ticketMessage');
      if (subject && msg && subject.value.trim() && msg.value.trim()) {
        showToast('Support ticket #TCK-941 logged. Our advisory team will respond shortly.', 'success');
        ticketForm.reset();
      } else {
        showToast('Please provide both ticket subject and message.', 'error');
      }
    });
  }

  // 10. Settings Form
  const userSettingsForm = document.getElementById('userSettingsForm');
  if (userSettingsForm) {
    userSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Account preferences updated successfully.', 'success');
    });
  }

  // Initial renders
  renderOpportunities();
  renderSavedProperties();
  renderTransactionsTable();
  renderInvestmentsTable();
});
