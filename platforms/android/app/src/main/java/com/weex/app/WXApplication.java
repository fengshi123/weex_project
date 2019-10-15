package com.weex.app;

import android.app.Application;
import android.content.Context;

import com.weex.app.adapter.DefaultWebSocketAdapterFactory;
import com.weex.app.extend.ImageAdapter;
import com.weex.app.extend.WXEventModule;
import com.weex.app.extend.WXCallModule;
import com.weex.app.extend.WXAlbumModule;
import com.weex.app.extend.WXCloseModule;
import com.alibaba.weex.plugin.loader.WeexPluginContainer;
import com.weex.app.util.AppConfig;
import com.taobao.weex.InitConfig;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.common.WXException;

public class WXApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate();
    WXSDKEngine.addCustomOptions("appName", "WXSample");
    WXSDKEngine.addCustomOptions("appGroup", "WXApp");
    WXSDKEngine.initialize(this,
        new InitConfig.Builder().setImgAdapter(new ImageAdapter()).setWebSocketAdapterFactory(new DefaultWebSocketAdapterFactory()).build()
    );
    try {
      WXSDKEngine.registerModule("wxalbum", WXAlbumModule.class);
      WXSDKEngine.registerModule("wxcall", WXCallModule.class);
      WXSDKEngine.registerModule("wxclose", WXCloseModule.class);
      WXSDKEngine.registerModule("event", WXEventModule.class);
      WeexPluginContainer.loadAll(getApplicationContext());
    } catch (WXException e) {
      e.printStackTrace();
    }
    AppConfig.init(this);
    WeexPluginContainer.loadAll(this);
  }
}
