import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Set viewport to mobile-ish for better testing
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto("http://localhost:5174/tarumt-bus-schedule/", {
      waitUntil: "networkidle",
    });

    // Select options to show the bottom bus
    await page.selectOption('select:nth-of-type(1)', { index: 1 });
    await page.selectOption('select:nth-of-type(2)', { index: 1 });
    await page.selectOption('select:nth-of-type(3)', { index: 1 });
    
    // Wait for results to appear
    await page.waitForTimeout(500);

    // Screenshot at top
    console.log("📸 Taking screenshot at top of page...");
    await page.screenshot({ path: "scroll-top.png" });

    // Scroll to bottom
    console.log("📍 Scrolling to bottom...");
    await page.evaluate(() => {
      window.scrollBy(0, document.documentElement.scrollHeight);
    });
    
    await page.waitForTimeout(300);
    
    // Screenshot at bottom
    console.log("📸 Taking screenshot at bottom of page...");
    await page.screenshot({ path: "scroll-bottom.png" });

    // Check bus positions
    const positions = await page.evaluate(() => {
      const topBus = document.querySelector(".bus-logo");
      const bottomBus = document.querySelector(".bus-logo-bottom");
      
      if (!topBus || !bottomBus) return "Buses not found";
      
      const topStyle = topBus.getAttribute("style");
      const bottomStyle = bottomBus.getAttribute("style");
      
      return {
        topBusTransform: topStyle,
        bottomBusTransform: bottomStyle,
      };
    });

    console.log("✅ Bus positions:", JSON.stringify(positions, null, 2));

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
  }
})();
