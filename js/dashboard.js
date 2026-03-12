/**
 * SportSphere Dashboard Controller
 * Handles sync, charts, and operational logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard Intelligence Module Active...");

    // 1. Chart.js Implementation
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue (LKR)',
                    data: [65000, 59000, 80000, 81000, 56000, 95000, 120000],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#8b5cf6',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // 2. Count-Up Animations
    const animateCount = (id, end, suffix = '', prefix = '') => {
        const el = document.getElementById(id);
        if (!el) return;
        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const increment = end / (duration / stepTime);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                el.innerText = prefix + Math.floor(end).toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                el.innerText = prefix + Math.floor(start).toLocaleString() + suffix;
            }
        }, stepTime);
    };

    animateCount('count-bookings', 1560);
    animateCount('count-revenue', 450000, '', 'LKR ');
    animateCount('count-util', 82, '%');

    // 3. Dynamic Arena Grid
    const slotGrid = document.getElementById('slot-grid');
    if (slotGrid) {
        const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
        const arenas = ['Alpha', 'Nexus', 'Elite'];
        let html = '';
        arenas.forEach(arena => {
            times.forEach(time => {
                const isBooked = Math.random() < 0.3;
                html += `
                    <div class="glass slot-item ${isBooked ? 'locked' : ''}" style="border: 1px solid ${isBooked ? '#ef4444' : 'var(--glass-border)'}">
                        <p style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${arena}</p>
                        <p style="font-weight: 700; font-size: 1.1rem; color: ${isBooked ? '#ef4444' : 'white'}">${time}</p>
                        <p style="font-size: 0.65rem; margin-top: 8px;">${isBooked ? 'OCCUPIED' : 'OPERATIONAL'}</p>
                    </div>
                `;
            });
        });
        slotGrid.innerHTML = html;
    }

    // 4. Global Operations (Exported to Window for HTML accessibility)
    window.rapidBooking = () => {
        alert("SportSphere Intelligence: Opening Rapid Booking Interface...");
    };

    window.systemLockdown = () => {
        const confirmLock = confirm("Institutional Warning: Are you sure you want to trigger System Lockdown?");
        if (confirmLock) {
            document.body.style.filter = "grayscale(1) contrast(1.2)";
            alert("Lockdown Protocol Active. Redirection restricted.");
        }
    };

    window.exportData = () => {
        console.log("Generating Institutional Yield Report...");
        alert("Downloading Revenue Yield Analysis (PDF)...");
    };
});

// Ensure functions are available even if DOMContentLoaded has already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Re-bind if necessary, though the above should handle it
}
