// notifications.js
let lastStatus = null;

document.addEventListener('DOMContentLoaded', () => {
    // Simple Polling for Responder Status Change
    setInterval(checkStatus, 5000);
});

async function checkStatus() {
    try {
        const res = await fetch('/api/me');
        if (res.ok) {
            const user = await res.json();

            if (user.role === 'responder') {
                if (lastStatus && lastStatus !== 'deployed' && user.status === 'deployed') {
                    Swal.fire({
                        title: 'DEPLOYMENT ALERT!',
                        text: 'You have been deployed to an incident! Check your map.',
                        icon: 'warning',
                        confirmButtonText: 'Go to Map'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/responder';
                        }
                    });
                    // Play sound?
                }
                lastStatus = user.status;
            }
        }
    } catch (e) {
        // console.error(e);
    }
}
