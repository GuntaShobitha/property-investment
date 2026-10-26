/**
 * STACKLY PROPERTY INVESTMENT — SHARED UI COMPONENTS & UTILITIES
 */

// Toast Notifications System
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'error';

    toast.innerHTML = `
      <span class="material-symbols-outlined">${icon}</span>
      <div class="toast-message">${message}</div>
    `;

    this.container.appendChild(toast);

    // Trigger entrance animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
};

// Global shorthand
function showToast(message, type = 'info') {
  Toast.show(message, type);
}

// Modal Windows Controller
const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  initGlobalListeners() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });
  }
};

// CSV Exporter Utility
function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) {
    showToast('No records available to export', 'error');
    return;
  }

  const csvRows = [];
  if (headers && headers.length) {
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
  }

  rows.forEach(row => {
    const values = row.map(cell => {
      const val = cell === null || cell === undefined ? '' : String(cell);
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${filename}.csv successfully`, 'success');
}

// Currency & Number Formatters
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

// LocalStorage Persistence Helpers for Demo Data
function getStoredData(key, fallback) {
  try {
    const val = localStorage.getItem(`stackly_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredData(key, data) {
  try {
    localStorage.setItem(`stackly_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Initialize components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  Modal.initGlobalListeners();
});
