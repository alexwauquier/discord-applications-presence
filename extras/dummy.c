#include <windows.h>

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
  if (msg == WM_DESTROY) {
    PostQuitMessage(0);
    return 0;
  }

  return DefWindowProc(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE _, LPSTR __, int nCmdShow) {
  const char CLASS_NAME[] = "WindowClass";

  WNDCLASS wc = {0};
  wc.lpfnWndProc = WndProc;
  wc.hInstance = hInstance;
  wc.lpszClassName = CLASS_NAME;

  RegisterClass(&wc);

  HWND hwnd = CreateWindowEx(
    0, CLASS_NAME, "SimulatedApp", WS_OVERLAPPEDWINDOW,
    CW_USEDEFAULT, CW_USEDEFAULT, 400, 300,
    NULL, NULL, hInstance, NULL);

  if (!hwnd) return 0;

  ShowWindow(hwnd, nCmdShow);

  MSG msg;

  while (GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }

  return 0;
}
