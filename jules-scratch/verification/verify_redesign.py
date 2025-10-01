from playwright.sync_api import sync_playwright, Page
import os

def take_screenshot(page: Page, file_name: str):
    """Navigates to a local HTML file and takes a screenshot."""
    file_path = f"file://{os.getcwd()}/{file_name}"
    page.goto(file_path)
    # Wait for the preloader fade out transition to complete
    page.wait_for_timeout(1000)
    page.screenshot(path=f"jules-scratch/verification/{file_name.replace('.html', '.png')}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    files_to_capture = [
        "index.html",
        "about.html",
        "apply.html",
        "blog.html",
        "contact.html",
        "events.html",
        "faq.html",
        "gallery.html",
        "press.html",
        "privacy-policy.html",
        "registration.html",
        "sponsors.html",
        "terms-of-service.html"
    ]

    for file in files_to_capture:
        take_screenshot(page, file)

    browser.close()