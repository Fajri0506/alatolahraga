const bcrypt = require('bcrypt');

async function checkHash() {
    const hash = '$2b$10$FBIfxhHep7Y9/5NiesKnzuCGjEuMdJL3BdW.CaUC8HnFiiiboWPzS';
    const isMatch = await bcrypt.compare('admin123', hash);
    console.log('admin123 match:', isMatch);
}

checkHash();
