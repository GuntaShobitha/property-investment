/**
 * STACKLY PROPERTY INVESTMENT — ADMIN DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Demo Properties Database
  const defaultAdminProperties = [
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
      image: './images/property-1.webp'
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
      image: './images/property-2.webp'
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
      image: './images/property-3.webp'
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
      status: 'Under Review',
      image: './images/property-4.webp'
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
      image: './images/property-5.webp'
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
      image: './images/property-6.webp'
    }
  ];

  let adminProps = getStoredData('admin_properties', defaultAdminProperties);

  // Demo Admin Enquiries
  const defaultEnquiries = [
    { id: 'ENQ-1042', name: 'Lord Henry Cavendish', email: 'h.cavendish@mayfaircapital.co.uk', type: 'Residential Co-Investment', message: 'Requesting confidential prospectus for The Aurum Penthouse allocation.', date: '2026-10-22', status: 'New' },
    { id: 'ENQ-1039', name: 'Dr. Vivienne Rothschild', email: 'v.rothschild@geneva-trust.ch', type: 'Commercial Grade-A', message: 'Evaluating European real estate syndication opportunities in Frankfurt.', date: '2026-10-20', status: 'In Review' },
    { id: 'ENQ-1031', name: 'Sebastian Thorne', email: 'thorne@thornepartners.com', type: 'High-Yield Rental', message: 'Seeking French Riviera vacation rental fund prospectus.', date: '2026-10-18', status: 'Closed' }
  ];

  let adminEnquiries = getStoredData('demo_enquiries', defaultEnquiries);

  // Demo Admin Support Tickets
  const defaultTickets = [
    { id: 'TCK-501', user: 'Marcus Sterling', subject: 'Tax Withholding Certificate for German Commercial Asset', priority: 'High', status: 'Open', date: '2026-10-21' },
    { id: 'TCK-498', user: 'Helena Beaumont', subject: 'Automated Dividend Bank Wire Routing Update', priority: 'Medium', status: 'In Progress', date: '2026-10-19' },
    { id: 'TCK-482', user: 'Arthur Pendelton', subject: 'Verification of Secondary Market Co-ownership Share', priority: 'Low', status: 'Resolved', date: '2026-10-14' }
  ];

  let adminTickets = getStoredData('admin_tickets', defaultTickets);

  // --- Dynamic Admin Profile from Session ---
  function loadAdminProfile() {
    try {
      const session = JSON.parse(localStorage.getItem('stackly_current_session'));
      if (session) {
        const nameEl = document.getElementById('adminDashUserName');
        const emailEl = document.getElementById('adminDashUserEmail');
        const roleEl = document.getElementById('adminDashUserRole');
        if (nameEl) nameEl.textContent = session.name || 'Administrator';
        if (emailEl) emailEl.textContent = session.email || '—';
        if (roleEl) {
          roleEl.textContent = session.role === 'Admin' ? 'Executive' : 'Administrator';
        }
      }
    } catch (e) { /* ignore */ }
  }
  loadAdminProfile();

  // 1. Navigation / View Switcher (13 Views)
  const navButtons = document.querySelectorAll('.dash-nav-btn');
  const viewSections = document.querySelectorAll('.dash-view-section');
  const breadcrumbEl = document.querySelector('.dash-breadcrumbs');

  function switchView(targetViewId) {
    viewSections.forEach(sec => sec.classList.remove('active'));

    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === targetViewId) {
        btn.classList.add('active');
        if (breadcrumbEl) {
          const viewTitle = btn.textContent.trim().replace(/[0-9]/g, '');
          breadcrumbEl.textContent = `Executive Portal / ${viewTitle}`;
        }
      }
    });

    const activeSec = document.getElementById(`view-${targetViewId}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    const sidebar = document.querySelector('.dash-sidebar');
    if (sidebar) sidebar.classList.remove('drawer-open');

    if (targetViewId === 'properties') renderPropertiesTable();
    if (targetViewId === 'enquiries') renderEnquiriesTable();
    if (targetViewId === 'tickets') renderTicketsTable();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view');
      if (viewId === 'logout') {
        showToast('Terminating executive session...', 'info');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 600);
        return;
      }
      switchView(viewId);
    });
  });

  // Mobile Drawer Toggle
  const toggleBtn = document.querySelector('.dash-sidebar-toggle-btn');
  const sidebar = document.querySelector('.dash-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('drawer-open');
    });
  }

  // 2. Property Management CRUD
  const propTableBody = document.getElementById('adminPropTableBody');
  const propSearch = document.getElementById('adminPropSearch');
  const propCategoryFilter = document.getElementById('adminPropCategoryFilter');

  function renderPropertiesTable() {
    if (!propTableBody) return;

    const searchTerm = propSearch ? propSearch.value.toLowerCase().trim() : '';
    const selectedCategory = propCategoryFilter ? propCategoryFilter.value : 'All';

    const filtered = adminProps.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm) || p.location.toLowerCase().includes(searchTerm);
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      propTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No properties found.</td></tr>`;
      return;
    }

    propTableBody.innerHTML = filtered.map(p => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${p.id}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <img src="${p.image}" alt="${p.title}" style="width: 44px; height: 32px; object-fit: cover; border-radius: 2px;">
            <div>
              <div style="font-weight: 600; color: var(--color-heading);">${p.title}</div>
              <div style="font-size: 0.78rem; color: var(--color-muted);">${p.location}</div>
            </div>
          </div>
        </td>
        <td><span class="dash-status-pill status-verified">${p.category}</span></td>
        <td style="font-weight: 600;">${formatCurrency(p.indicativePrice)}</td>
        <td style="color: #208850; font-weight: 600;">${p.projectedYield}</td>
        <td><span class="dash-status-pill ${p.status === 'Active' ? 'status-active' : 'status-pending'}">${p.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="table-action-btn edit-prop-btn" data-id="${p.id}" title="Edit Property">
              <span class="material-symbols-outlined" style="font-size: 1.15rem;">edit</span>
            </button>
            <button class="table-action-btn delete delete-prop-btn" data-id="${p.id}" title="Delete Property">
              <span class="material-symbols-outlined" style="font-size: 1.15rem;">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach Edit and Delete listeners
    propTableBody.querySelectorAll('.edit-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditPropertyModal(btn.getAttribute('data-id')));
    });

    propTableBody.querySelectorAll('.delete-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteProperty(btn.getAttribute('data-id')));
    });
  }

  if (propSearch) propSearch.addEventListener('input', renderPropertiesTable);
  if (propCategoryFilter) propCategoryFilter.addEventListener('change', renderPropertiesTable);

  // Add Property Handler
  const addPropBtn = document.getElementById('openAddPropModalBtn');
  const addPropForm = document.getElementById('addPropertyForm');

  if (addPropBtn) {
    addPropBtn.addEventListener('click', () => {
      if (addPropForm) addPropForm.reset();
      Modal.open('addPropModal');
    });
  }

  if (addPropForm) {
    addPropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newPropTitle').value.trim();
      const category = document.getElementById('newPropCategory').value;
      const location = document.getElementById('newPropLocation').value.trim();
      const price = parseFloat(document.getElementById('newPropPrice').value);
      const minInv = parseFloat(document.getElementById('newPropMinInv').value);
      const yieldVal = document.getElementById('newPropYield').value.trim();

      if (!title || !location || isNaN(price)) {
        showToast('Please provide valid title, location, and valuation.', 'error');
        return;
      }

      const newProp = {
        id: 'PROP-0' + (adminProps.length + 1),
        title,
        category,
        location,
        indicativePrice: price,
        minInvestment: minInv || 50000,
        projectedYield: yieldVal || '8.0%',
        holdingPeriod: '3 - 5 Years',
        status: 'Active',
        image: './images/property-' + ((adminProps.length % 6) + 1) + '.webp'
      };

      adminProps.unshift(newProp);
      setStoredData('admin_properties', adminProps);
      setStoredData('properties', adminProps); // Also sync with investor view!

      Modal.close('addPropModal');
      showToast(`Added "${title}" to platform inventory.`, 'success');
      renderPropertiesTable();
    });
  }

  // Edit Property
  function openEditPropertyModal(propId) {
    const prop = adminProps.find(p => p.id === propId);
    if (!prop) return;

    document.getElementById('editPropId').value = prop.id;
    document.getElementById('editPropTitle').value = prop.title;
    document.getElementById('editPropCategory').value = prop.category;
    document.getElementById('editPropLocation').value = prop.location;
    document.getElementById('editPropPrice').value = prop.indicativePrice;
    document.getElementById('editPropYield').value = prop.projectedYield;
    document.getElementById('editPropStatus').value = prop.status;

    Modal.open('editPropModal');
  }

  const editPropForm = document.getElementById('editPropertyForm');
  if (editPropForm) {
    editPropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editPropId').value;
      const prop = adminProps.find(p => p.id === id);
      if (prop) {
        prop.title = document.getElementById('editPropTitle').value.trim();
        prop.category = document.getElementById('editPropCategory').value;
        prop.location = document.getElementById('editPropLocation').value.trim();
        prop.indicativePrice = parseFloat(document.getElementById('editPropPrice').value);
        prop.projectedYield = document.getElementById('editPropYield').value.trim();
        prop.status = document.getElementById('editPropStatus').value;

        setStoredData('admin_properties', adminProps);
        setStoredData('properties', adminProps);

        Modal.close('editPropModal');
        showToast(`Updated "${prop.title}" successfully.`, 'success');
        renderPropertiesTable();
      }
    });
  }

  // Delete Property
  let propertyToDelete = null;
  function confirmDeleteProperty(propId) {
    propertyToDelete = propId;
    const prop = adminProps.find(p => p.id === propId);
    const deleteNameEl = document.getElementById('deletePropName');
    if (deleteNameEl && prop) {
      deleteNameEl.textContent = prop.title;
    }
    Modal.open('deletePropModal');
  }

  const confirmDeleteBtn = document.getElementById('confirmDeletePropBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (propertyToDelete) {
        adminProps = adminProps.filter(p => p.id !== propertyToDelete);
        setStoredData('admin_properties', adminProps);
        setStoredData('properties', adminProps);
        Modal.close('deletePropModal');
        showToast('Property permanently removed from platform records.', 'success');
        renderPropertiesTable();
        propertyToDelete = null;
      }
    });
  }

  // 3. Enquiries Table & Status Toggle
  const enquiryTableBody = document.getElementById('enquiryTableBody');
  function renderEnquiriesTable() {
    if (!enquiryTableBody) return;
    adminEnquiries = getStoredData('demo_enquiries', defaultEnquiries);

    if (adminEnquiries.length === 0) {
      enquiryTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No enquiries received yet.</td></tr>`;
      return;
    }

    enquiryTableBody.innerHTML = adminEnquiries.map(enq => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${enq.id}</td>
        <td>
          <div style="font-weight: 600; color: var(--color-heading);">${enq.name}</div>
          <div style="font-size: 0.78rem; color: var(--color-muted);">${enq.email}</div>
        </td>
        <td><span class="dash-status-pill status-verified">${enq.type}</span></td>
        <td style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${enq.message}</td>
        <td>${enq.date}</td>
        <td>
          <select class="dash-filter-select enq-status-select" data-id="${enq.id}" style="padding: 0.35rem 1.8rem 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="New" ${enq.status === 'New' ? 'selected' : ''}>New</option>
            <option value="In Review" ${enq.status === 'In Review' ? 'selected' : ''}>In Review</option>
            <option value="Closed" ${enq.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
      </tr>
    `).join('');

    enquiryTableBody.querySelectorAll('.enq-status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const id = sel.getAttribute('data-id');
        const enq = adminEnquiries.find(e => e.id === id);
        if (enq) {
          enq.status = sel.value;
          setStoredData('demo_enquiries', adminEnquiries);
          showToast(`Enquiry ${id} status updated to ${sel.value}`, 'info');
        }
      });
    });
  }

  // 4. Tickets Table & Status Toggle
  const ticketTableBody = document.getElementById('adminTicketTableBody');
  function renderTicketsTable() {
    if (!ticketTableBody) return;
    ticketTableBody.innerHTML = adminTickets.map(tck => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${tck.id}</td>
        <td style="font-weight: 600;">${tck.user}</td>
        <td>${tck.subject}</td>
        <td><span class="dash-status-pill ${tck.priority === 'High' ? 'status-rejected' : 'status-pending'}">${tck.priority}</span></td>
        <td>
          <select class="dash-filter-select tck-status-select" data-id="${tck.id}" style="padding: 0.35rem 1.8rem 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="Open" ${tck.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="In Progress" ${tck.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${tck.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
        <td>${tck.date}</td>
      </tr>
    `).join('');

    ticketTableBody.querySelectorAll('.tck-status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const id = sel.getAttribute('data-id');
        const tck = adminTickets.find(t => t.id === id);
        if (tck) {
          tck.status = sel.value;
          setStoredData('admin_tickets', adminTickets);
          showToast(`Ticket ${id} status marked as ${sel.value}`, 'info');
        }
      });
    });
  }

  // 5. CSV Exporters for Admin Records
  const exportAdminTxBtn = document.getElementById('exportAdminTxBtn');
  if (exportAdminTxBtn) {
    exportAdminTxBtn.addEventListener('click', () => {
      const headers = ['Tx ID', 'Investor', 'Property', 'Type', 'Amount (USD)', 'Date', 'Status'];
      const rows = [
        ['TX-1004', 'Marcus Sterling', 'The Aurum Penthouse', 'Capital Call', '150000', '2026-03-15', 'Settled'],
        ['TX-1003', 'Helena Beaumont', 'Grandview Financial Plaza', 'Capital Call', '250000', '2026-01-20', 'Settled'],
        ['TX-1002', 'Arthur Pendelton', 'Kensington Residences', 'Capital Call', '75000', '2025-11-10', 'Settled'],
        ['TX-1001', 'Mayfair Syndicate', 'Belgravia Heritage', 'Syndication', '500000', '2025-09-04', 'Settled']
      ];
      exportToCSV('STACKLY_Admin_Master_Transactions', rows, headers);
    });
  }

  const exportReportBtn = document.getElementById('exportReportBtn');
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', () => {
      const headers = ['Quarter', 'AUM (USD)', 'Active Investors', 'Capital Deployed', 'Avg Net Yield'];
      const rows = [
        ['Q3 2026', '142000000', '328', '38500000', '8.7%'],
        ['Q2 2026', '124000000', '294', '29000000', '8.5%'],
        ['Q1 2026', '108000000', '261', '22400000', '8.4%'],
        ['Q4 2025', '96000000', '230', '19200000', '8.2%']
      ];
      exportToCSV('STACKLY_Institutional_AUM_Report', rows, headers);
    });
  }

  // 6. Blog Management Handlers
  const addBlogForm = document.getElementById('adminBlogForm');
  if (addBlogForm) {
    addBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('blogPostTitle').value.trim();
      if (title) {
        showToast(`Article "${title}" drafted and scheduled for publication.`, 'success');
        addBlogForm.reset();
      }
    });
  }

  // 7. System Settings Form
  const adminSettingsForm = document.getElementById('adminSettingsForm');
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Global platform configurations saved.', 'success');
    });
  }

  // Initial renders
  renderPropertiesTable();
  renderEnquiriesTable();
  renderTicketsTable();
});
