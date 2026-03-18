const cron = require('node-cron');
const axios = require('axios');
const SteelPrice = require('../models/SteelPrice');

// A function to fetch latest prices from Metals-API and update the database
const updateSteelPrices = async () => {
    try {
        console.log('Fetching latest metal prices from Metals-API...');
        
        // Metals-API endpoint for latest rates. 
        // Note: You need an active API key from metals-api.com
        const apiKey = process.env.METALS_API_KEY;
        
        if (!apiKey) {
            console.log('Metals API Key missing. Skipping automatic update.');
            return;
        }

        // Example: fetching LME Steel or Iron ore prices 
        // You might use symbol 'STEEL' or another appropriate symbol provided by the API
        const response = await axios.get(`https://metals-api.com/api/latest`, {
            params: {
                access_key: apiKey,
                base: 'INR',
                symbols: 'STEEL' // Replace with proper symbol if needed (e.g., LME-STL)
            }
        });

        if (response.data && response.data.success) {
            const rawMetalPrice = response.data.rates.STEEL; // Price in INR
            
            // Because TMT bars are processed steel, their price per ton
            // will be the raw metal price + processing & manufacturing costs + margin.
            // For this implementation, we can simulate updating the prices based on a percentage change
            // or by establishing a base rate factor based on the API response.
            // Assuming the API gives a base ton rate, we add a premium for TMT processing based on thickness.
            
            const currentTiers = await SteelPrice.find({});
            
            if (currentTiers.length === 0) return;

            // This is a sample calculation strategy. 
            // In a real-world scenario, you might multiply the raw base price by some factor for each thickness.
            // Example: updatedPrice = rawMetalPrice + (Base Premium per thickness)
            
            for (let tier of currentTiers) {
                // Let's assume we derive the new price by adjusting the current price proportionally 
                // Alternatively, we use the rawMetalPrice if it reflects finished steel directly.
                // For demonstration, let's just use rawMetalPrice + manufacturing premium:
                
                // Let's pretend previous raw price was around 60000. We can calculate a multiplier.
                // Here we just apply a hypothetical base + premium logic:
                const premium = tier.thickness < 10 ? 3000 : tier.thickness > 25 ? 3000 : 1800;
                
                // If API didn't return a proper value, skip
                if (!rawMetalPrice) continue;

                // Update the price
                const calculatedPrice = Math.floor(rawMetalPrice + premium);
                
                tier.pricePerTon = calculatedPrice;
                await tier.save();
            }

            console.log('Successfully updated TMT Steel Prices based on Metals-API data.');
        } else {
            console.error('Metals-API returned an error:', response.data?.error?.info || 'Unknown error');
        }

    } catch (error) {
        console.error('Failed to update steel prices from API:', error.message);
    }
};

// Schedule to run every day at midnight (00:00)
// You can adjust the cron string to run more frequently, e.g., '0 * * * *' for every hour
cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled daily steel price update...');
    updateSteelPrices();
});

module.exports = updateSteelPrices;
