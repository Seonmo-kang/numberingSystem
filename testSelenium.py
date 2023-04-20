import ctypes, time, os, sys
import selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

user = ctypes.windll.user32

class RECT(ctypes.Structure):
  _fields_ = [
    ('left', ctypes.c_long),
    ('top', ctypes.c_long),
    ('right', ctypes.c_long),
    ('bottom', ctypes.c_long)
    ]
  def dump(self):
    return [int(val) for val in (self.left, self.top, self.right, self.bottom)]

class MONITORINFO(ctypes.Structure):
  _fields_ = [
    ('cbSize', ctypes.c_ulong),
    ('rcMonitor', RECT),
    ('rcWork', RECT),
    ('dwFlags', ctypes.c_ulong)
    ]

def get_monitors():
  retval = []
  CBFUNC = ctypes.WINFUNCTYPE(ctypes.c_int, ctypes.c_ulong, ctypes.c_ulong, ctypes.POINTER(RECT), ctypes.c_double)
  def cb(hMonitor, hdcMonitor, lprcMonitor, dwData):
    r = lprcMonitor.contents
    #print("cb: %s %s %s %s %s %s %s %s" % (hMonitor, type(hMonitor), hdcMonitor, type(hdcMonitor), lprcMonitor, type(lprcMonitor), dwData, type(dwData)))
    data = [hMonitor]
    data.append(r.dump())
    retval.append(data)
    return 1
  cbfunc = CBFUNC(cb)
  temp = user.EnumDisplayMonitors(0, 0, cbfunc, 0)
  #print(temp)
  return retval

def monitor_areas():
  retval = []
  monitors = get_monitors()
  for hMonitor, extents in monitors:
    data = [hMonitor]
    mi = MONITORINFO()
    mi.cbSize = ctypes.sizeof(MONITORINFO)
    mi.rcMonitor = RECT()
    mi.rcWork = RECT()
    res = user.GetMonitorInfoA(hMonitor, ctypes.byref(mi))
    data = mi.rcMonitor.dump()
#    data.append(mi.rcWork.dump())
    retval.append(data)
  return retval

###
# Board page opening
###
windowUsername = os.getenv('username')
USERDATAPATH = r"C:/numberingSystem/ChromeProfile"
# USERDATAPATH = os.path.join(os.getcwd(),"ChromeProfile")

def openBoardPage(browser2,w,h):
  try:
    options = Options()
    browser2.add_argument('excludeSwitches', ['enable-automation'])
    browser2.add_argument("detach", True)
    #Set option for (unknown error: DevToolsActivePort file doesn't exist)
    browser2.add_argument("--no-sandbox")
    browser2.add_argument("--disable-setuid-sandbox")
    browser2.add_argument("--disable-dev-shm-using")

    # Board page
    browser2(options=options)
    browser2.set_window_position(w,h)
    browser2.get('http://localhost:3000/board')
    browser2.maximize_window()
    browser2.fullscreen_window()
  except Exception as e: print(e)
    
###
# Numberpade page opening
###
def openNumberpadPage(browser,w,h):
  try:
    options = Options()
    browser.add_argument('excludeSwitches', ['enable-automation'])
    browser.add_argument("detach", True)
    #Set option for (unknown error: DevToolsActivePort file doesn't exist)
    browser.add_argument("--no-sandbox")
    browser.add_argument("--disable-setuid-sandbox")

    #Set chrome profile
    browser.add_argument(f"--user-data-dir={USERDATAPATH}")
    browser.add_argument('--profile-directory=Default')

    
    # Numberpad page
    browser.set_window_position(w,h)
    browser.get('http://localhost:3000/numberpad')
    browser.maximize_window()
  except Exception as e: print(e)

if __name__ == "__main__":
    detected_monitors = monitor_areas()
    browser = webdriver.Chrome()
    browser2 = webdriver.Chrome()
    openNumberpadPage(browser,detected_monitors[0][0],detected_monitors[0][1])
    openBoardPage(browser2,detected_monitors[1][0],detected_monitors[1][1])
    # os.system("pause")
    print(monitor_areas())
    while True:
      try:
        _ = browser.window_handles
        _ = browser2.window_handles
      except BaseException as e:
        break
      time.sleep(1)
    
    
    
