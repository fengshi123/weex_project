package com.weex.app.extend;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.StrictMode;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.widget.Toast;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;
import com.weex.app.WXPageActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import static com.squareup.okhttp.internal.Internal.logger;

public class WXAlbumModule extends WXModule{

    public static final int REQUEST_CODE = 10010;
    public final static int CAMERA_REQUEST_CODE= 1;

    protected JSCallback callback;
    protected String type;
    protected String path;
    protected String url;
    protected String token;

    @JSMethod(uiThread = true)
    public void choosePhoto(String param, JSCallback callback) {
        if (ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(),
                Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions((WXPageActivity) mWXSDKInstance.getContext(),
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                    CAMERA_REQUEST_CODE);
        } else {
            choosePhoto();
        }
        try{
            JSONObject jsonObject = new JSONObject(param);
            this.type = (String)jsonObject.get("type");
            this.path = (String)jsonObject.get("path");
            this.url = (String)jsonObject.get("url");
            this.token = (String)jsonObject.get("token");
        }catch (JSONException e){
            e.printStackTrace();
        }
        this.callback = callback;

    }

    private void choosePhoto() {
        Intent intentToPickPic = new Intent(Intent.ACTION_PICK, null);   intentToPickPic.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, this.type);
        ((Activity) (mWXSDKInstance.getContext())).startActivityForResult(intentToPickPic, CAMERA_REQUEST_CODE);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == WXPageActivity.RESULT_OK) {
            switch (requestCode) {
                case CAMERA_REQUEST_CODE: {
                    try {
                        Uri selectedImage = data.getData();
                        String[] filePathColumns = {MediaStore.Images.Media.DATA};
                        Cursor c = mWXSDKInstance.getContext().getContentResolver().query(selectedImage, filePathColumns, null, null, null);
                        c.moveToFirst();
                        int columnIndex = c.getColumnIndex(filePathColumns[0]);
                        String picturePath = c.getString(columnIndex);
                        c.close();

                        //上传的文件
                        File file = new File(picturePath);
                        // 普通参数
                        HashMap<String , String> params = new HashMap<>();
                        params.put("path", this.path);
                        uploadForm(params, "file", file, "", this.url);

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    // 分割符
    private static final String BOUNDARY = "----WebKitFormBoundaryT1HoybnYeFOGFlBR";
    /**
     * HttpUrlConnection　实现文件上传
     * @param params 普通参数
     * @param fileFormName 文件在表单中的键
     * @param uploadFile 上传的文件
     * @param newFileName 文件在表单中的值（服务端获取到的文件名）
     * @param urlStr url
     * @throws
     */
    public  void uploadForm(Map<String, String> params, String fileFormName, File uploadFile, String newFileName,
                                  String urlStr) throws IOException {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        if (newFileName == null || newFileName.trim().equals("")) {
            newFileName = uploadFile.getName();
        }
        //开始拼接数据
        StringBuilder sb = new StringBuilder();
        /**
         * 普通的表单数据
         */
        if (params != null) {
            for (String key : params.keySet()) {
                sb.append("--" + BOUNDARY + "\r\n");
                sb.append("Content-Disposition: form-data; name=\"" + key + "\"" + "\r\n");
                sb.append("\r\n");
                sb.append(params.get(key) + "\r\n");
            }
        }

        /**
         * 上传文件的头
         */
        sb.append("--" + BOUNDARY + "\r\n");
        sb.append("Content-Disposition: form-data; name=\"" + fileFormName + "\"; filename=\"" + newFileName + "\""
                + "\r\n");
        sb.append("Content-Type: " +this.type+ "\r\n");// 如果服务器端有文件类型的校验，必须明确指定ContentType
        sb.append("Authorization: " +this.token+ "\r\n");
        sb.append("\r\n");

        byte[] headerInfo = sb.toString().getBytes("UTF-8");
        byte[] endInfo = ("\r\n--" + BOUNDARY + "--\r\n").getBytes("UTF-8");


        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        // 设置传输内容的格式，以及长度
        conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);
        conn.setRequestProperty("Authorization",this.token);
        conn.setRequestProperty("Content-Length",
                String.valueOf(headerInfo.length + uploadFile.length() + endInfo.length));
        conn.setDoOutput(true);

        OutputStream out = conn.getOutputStream();
        InputStream in = new FileInputStream(uploadFile);
        // 写入头部 （包含了普通的参数，以及文件的标示等）
        out.write(headerInfo);
        // 写入文件
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) != -1) {
            out.write(buf, 0, len);
        }
        // 写入尾部
        out.write(endInfo);
        in.close();
        out.close();
        if (conn.getResponseCode() == 200) {
        // 请求返回的数据
        InputStream inputStream  = conn.getInputStream();
        //获取响应
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line = null;
        String result = null;
        while ((line = reader.readLine()) != null) {
           if(result==null) {
               result = line;
           }else{
              result += line;
           }
        }
        callback.invoke(result);
        reader.close();
        conn.disconnect();
        }
    }
}