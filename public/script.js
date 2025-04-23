document.addEventListener('DOMContentLoaded', async () => {
    const companiesContainer = document.getElementById('companies-container');
    if (!companiesContainer) return; // Exit if not on the home page

    // Sample company data (replace with your actual companies)
    const companies = [
        { name: 'Google', logo: 'assets/google.png' },
        { name: 'Microsoft', logo: 'assets/microsoft.png' },
        { name: 'Amazon', logo: 'assets/amazon.png' },
        { name: 'Meta', logo: 'assets/meta.png' },
        { name: 'Apple', logo: 'assets/apple.png' },
        { name: 'Netflix', logo: 'assets/netflix.png' }
    ];

    // Create company cards
    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'company-card';
        card.innerHTML = `
            <img src="${company.logo}" alt="${company.name} Logo" onerror="this.src='assets/default-company.png'">
            <h3>${company.name}</h3>
        `;

        // Add click event to redirect to company page
        card.addEventListener('click', () => {
            const companyPath = encodeURIComponent(company.name.toLowerCase());
            window.location.href = `company.html?company=${companyPath}`;
        });

        companiesContainer.appendChild(card);
    });
});