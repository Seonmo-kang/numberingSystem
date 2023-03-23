import ctypes
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from startWebpage import * 

if __name__ == "__main__":
    detected_monitors = monitor_areas()
    openBoardPage(detected_monitors[1][0],detected_monitors[1][1])
    print(monitor_areas())
    os.system("pause")
    
    
    
