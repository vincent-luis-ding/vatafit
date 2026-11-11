package com.vitamap.app

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.setSupportZoom(false)
            settings.textZoom = 100
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            setBackgroundColor(Color.parseColor("#F4F6F3"))
        }
        setContentView(webView)

        // The whole app is an offline bundle inside assets, no network needed.
        webView.loadUrl("file:///android_asset/index.html")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (!this::webView.isInitialized) {
            finish()
            return
        }
        // Let the single page app unwind its own view stack (result -> form -> check).
        webView.evaluateJavascript(
            "(function(){try{return window.VitaMap&&window.VitaMap.handleBack?window.VitaMap.handleBack():false}catch(e){return false}})()"
        ) { value ->
            if (value == null || value == "false" || value == "null") {
                finish()
            }
        }
    }
}
