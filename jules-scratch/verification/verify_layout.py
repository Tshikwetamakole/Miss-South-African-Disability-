import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_frontend_changes(page: Page):
    """
    This script verifies the frontend changes by taking screenshots
    of the index page at both desktop and mobile resolutions.
    """
    # Get the absolute path to the index.html file
    file_path = f"file://{os.path.abspath('index.html')}"

    # 1. Desktop verification
    page.set_viewport_size({"width": 1280, "height": 800})
    page.goto(file_path)
    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/desktop_view.png")

    # 2. Mobile verification
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto(file_path)
    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/mobile_view.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    verify_frontend_changes(page)
    browser.close()