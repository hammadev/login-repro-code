import { promises as fs } from 'fs';

export async function saveCookies(username, cookies, platform) {
    const dir = `./src/services/cookies/${platform}`;

    try {
        await fs.mkdir(dir, { recursive: true }); // Creates the directory if it does not exist
        const filePath = `${dir}/${username}.json`;
        await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
        console.log(`Cookies saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving cookies:', error);
    }
}

export async function loadAndSetCookies(username, page,platform) {
    const dir = `./src/services/cookies/${platform}`;
    try {
        // Adjust the path to where you store cookies, and name files after the usernames
        const cookiesString = await fs.readFile(`${dir}/${username}.json`, 'utf8');
        const cookies = JSON.parse(cookiesString);

        // Set the cookies in the page
        await page.setCookie(...cookies);
        console.log('Cookies successfully loaded and set.');
    } catch (error) {
        console.error('Error loading or setting cookies:', error);
    }
}