import puppeteer from "puppeteer";
// import { delay } from "../../utils/Helpers.js";
import { promises as fs } from "fs";
import { saveCookies } from "./CookiesHelper.js";

const delay = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const Login = async (req, res) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.goto("https://www.instagram.com/accounts/login/");

  await page.waitForSelector("input[name=username]", { visible: true });
  await delay(100); // Adjust delay as needed
  await page.type("input[name=username]", process.env.USERNAME, { delay: 50 });

  await delay(100); // Adjust delay as needed
  await page.type("input[name=password]", process.env.PASSWORD, { delay: 50 });

  await delay(100); // Adjust delay as needed
  // const [signin] = await page.$x('//button[contains(.,"Log in")]');
  // await signin.click({ delay: 30 });
  await page.click('button[type="submit"]');

  try {
    try {
      const loginError = await page.waitForSelector(
        "xpath///div[contains(text(), 'Sorry, your password was incorrect. Please double-check your password.')]",
        { timeout: 1500 }
      );
      if (loginError) {
        return res.json({
          status: 0,
          message:
            "Sorry, you)r password was incorrect. Please double-check your password.",
        });
      }
    } catch (err) {
      console.log(err.message);
    }

    try {
      // Check if 2FA is required
      const requires2FA = await page.waitForSelector(
        'input[name="verificationCode"]'
      );

      if (requires2FA) {
        console.log("verificationCode field find");
        const message = await page.evaluate(
          () =>
            document.querySelector("#verificationCodeDescription").textContent
        );

        return res.json({
          status: 201,
          message: `2FA Required! ${message}`,
        });
      }

      // Continue with the rest of your login process...
    } catch (err) {
      console.log(err.message);
    }

    // Wait for navigation to home/feed page or a specific element that indicates a successful login.
    // This might need adjustment depending on Instagram's current layout and behavior.
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    // Additionally or alternatively, check for a specific element that indicates successful login:
    // await page.waitForSelector('yourSelectorHere', { timeout: 5000 });

    await page.waitForSelector(
      "xpath///div[contains(text(), 'Save your login info?')]",
      { timeout: 5000 }
    );

    // Once the popup is detected, click the "Save info" button.
    // Here we're also using XPath to find the button by its text content.
    const saveInfoButton = await page.waitForSelector(
      "xpath///button[contains(text(), 'Save info')]"
    );
    if (saveInfoButton) {
      await saveInfoButton.click();
      console.log('Clicked "Save info" button.');
    } else {
      console.log('"Save info" button not found.');
    }

    console.log("Login successful");
    const cookies = await page.cookies();
    await saveCookies(user.username, cookies, "insta");

    return res.json({
      status: 1,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Login failed:", error.message);
    return res.json({
      status: 0,
      message: "Login failed:" + error.message,
    });
  }
};

export const Get2FACode = async (req, res) => {
  // how can i continue already initiated login req from here
  return res.json({
    status: 1,
    otp_code:  req.otp_code,
  });
}