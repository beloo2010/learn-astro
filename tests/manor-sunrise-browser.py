"""Exercise the actual offline site on loopback and capture the spec's manual review views."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

root = Path(__file__).resolve().parents[1]
captures = root / "sunrise-captures"
captures.mkdir(exist_ok=True)
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(root)))
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}/site/"
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

with webdriver.Chrome(options=options) as browser:
    wait = WebDriverWait(browser, 15)
    browser.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
        "width": 1024, "height": 768, "deviceScaleFactor": 1, "mobile": False,
    })
    browser.execute_cdp_cmd("Network.enable", {})
    browser.execute_cdp_cmd("Network.setBlockedURLs", {"urls": ["https://*"]})
    browser.get(base + "#lab")
    wait.until(lambda b: b.find_element(By.LINK_TEXT, "Explore Manor sunrise")).click()
    wait.until(lambda b: b.find_element(By.ID, "clock").text)

    def open_view(date, clock=""):
        browser.get(base + f"manor-sunrise/?date={date}&time={clock}")
        wait.until(lambda b: b.find_element(By.ID, "clock").text)
        assert browser.execute_script("return document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight")

    def capture(name):
        browser.save_screenshot(str(captures / (name + ".png")))

    for date in ["2026-12-21", "2027-06-21", "2027-03-20"]:
        open_view(date)
        browser.find_elements(By.CSS_SELECTOR, "#ticks button")[1].click()
        assert "Sunrise!" in browser.find_element(By.ID, "phase").text
        capture(date + "-sunrise")
    for clock in ["11:00", "17:00"]:
        open_view("2027-03-20", clock)
        capture("equinox-" + clock.replace(":", ""))
    browser.find_element(By.ID, "play").click()
    wait.until(lambda b: b.find_element(By.ID, "time").get_attribute("value") != "1020")
    browser.find_element(By.ID, "play").click()
    assert browser.find_element(By.ID, "play").text == "Play"
    failures = [entry for entry in browser.get_log("browser")
                if entry["level"] == "SEVERE" and "favicon.ico" not in entry["message"]]
    assert not failures, failures
server.shutdown()
