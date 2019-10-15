package com.weex.app.extend;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.common.WXModule;
import com.taobao.weex.devtools.common.LogUtil;

public class WXCloseModule extends WXModule {
    @JSMethod(uiThread = false)
    public void closeApp() {
        System.exit(0);
    }
}
