import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:5174/tarumt-bus-schedule/", {
      waitUntil: "networkidle",
    });

    // Check if parallax-bg is visible
    const bgVisible = await page.evaluate(() => {
      const bg = document.querySelector(".parallax-bg");
      if (!bg) return "no element";
      const styles = window.getComputedStyle(bg);
      return {
        display: styles.display,
        visibility: styles.visibility,
        zIndex: styles.zIndex,
        backgroundImage: styles.backgroundImage,
        width: styles.width,
        height: styles.height
      };
    });

    console.log("Parallax BG info:", JSON.stringify(bgVisible, null, 2));

    await page.screenshot({ path: "sky-check.png" });

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();
