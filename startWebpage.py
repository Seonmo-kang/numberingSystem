import ctypes
import os
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

def openBoardPage(w,h):
  try:
    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    options.add_experimental_option("detach", True)
    #Set option for (unknown error: DevToolsActivePort file doesn't exist)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-setuid-sandbox")
    options.add_argument("--disable-dev-shm-using")

    # Board page
    browser2 = webdriver.Chrome(executable_path=r"C:\numberingSystem-dev\chromeDriver\chromedriver.exe",options= options)
    browser2.set_window_position(w,h)
    browser2.get('http://localhost:3000/board')
    browser2.maximize_window()
    browser2.fullscreen_window()
  except Exception as e: print(e)
    
###
# Numberpade page opening
###
def openNumberpadPage(w,h):
  try:
    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    options.add_experimental_option("detach", True)
    #Set option for (unknown error: DevToolsActivePort file doesn't exist)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-setuid-sandbox")

    #Set chrome profile
    options.add_argument(f"--user-data-dir={USERDATAPATH}")
    options.add_argument('--profile-directory=Default')

    # Numberpad page
    browser = webdriver.Chrome(executable_path=r"C:\numberingSystem-dev\chromeDriver\chromedriver.exe",options= options)
    browser.set_window_position(w,h)
    browser.get('http://localhost:3000/numberpad')
    browser.maximize_window()
  except Exception as e: print(e)

if __name__ == "__main__":
    detected_monitors = monitor_areas()
    openNumberpadPage(detected_monitors[0][0],detected_monitors[0][1])
    openBoardPage(detected_monitors[1][0],detected_monitors[1][1])
    os.system("pause")
    print(monitor_areas())
    
    
