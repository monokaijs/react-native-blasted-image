package com.xerdnu.blastedimage;

import com.bumptech.glide.Glide;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.BlastedImageViewManagerInterface;
import com.facebook.react.viewmanagers.BlastedImageViewManagerDelegate;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.widget.ImageView;
import android.view.View;
import android.view.ViewGroup;

import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;

import android.util.Log;

@ReactModule(name = BlastedViewManager.REACT_CLASS)
public class BlastedViewManager extends SimpleViewManager<ImageView> implements BlastedImageViewManagerInterface<ImageView> {

    public static final String REACT_CLASS = "BlastedImageView";
    private final ViewManagerDelegate<ImageView> mDelegate;
    private final ReactApplicationContext mReactContext;

    public BlastedViewManager(ReactApplicationContext reactContext) {
        mReactContext = reactContext;
        mDelegate = new BlastedImageViewManagerDelegate<>(this);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ImageView createViewInstance(@NonNull ThemedReactContext reactContext) {
        Log.d("BlastedViewManager", "BlastedImageView instance created");
        return new ImageView(reactContext);
    }

    @Override
    protected ViewManagerDelegate<ImageView> getDelegate() {
        return mDelegate;
    }

    @Override
    public void setSource(ImageView view, ReadableMap source) {
        if (source == null) {
            Log.e("BlastedViewManager", "Source is null");
            return;
        }
        
        Log.d("BlastedViewManager", "source value: " + source);

        try {
            String uri = source.hasKey("uri") ? source.getString("uri") : null;
            boolean hybridAssets = source.hasKey("hybridAssets") && source.getBoolean("hybridAssets");
            String cloudUrl = source.hasKey("cloudUrl") ? source.getString("cloudUrl") : null;
            
            BlastedImageModule blastedImageModule = new BlastedImageModule(mReactContext);

            Object glideUrl = blastedImageModule.prepareGlideUrl(uri, hybridAssets, cloudUrl, false); // false = Dont show logs when not preload

            Log.d("BlastedViewManager", "glideUrl value: " + glideUrl.toString());

            if (glideUrl != null && !glideUrl.toString().isEmpty()) {
                Glide.with(mReactContext.getCurrentActivity() != null ? mReactContext.getCurrentActivity() : view.getContext())
                    .load(glideUrl)
                    .into(view);
                view.setVisibility(View.VISIBLE);  // glideUrl is valid so show ImageView
            } else {
                view.setVisibility(View.INVISIBLE);  // Hide the ImageView
            }
        } catch (Exception e) {
            Log.e("BlastedViewManager", "Error setting glideUrl: " + e.getMessage());
            view.setVisibility(View.INVISIBLE); // Hide the ImageView
        }
    }

    @Override
    public void setResizeMode(ImageView view, String resizeMode) {
        Log.d("BlastedImageViewManager", "resizeMode value: " + resizeMode);

        // If resizeMode is not specified or is invalid, set to cover
        if (resizeMode == null || resizeMode.isEmpty() || "undefined".equals(resizeMode)) {
            resizeMode = "cover";
        }

        if ("contain".equals(resizeMode)) {
            view.setScaleType(ImageView.ScaleType.FIT_CENTER);
        } else if ("stretch".equals(resizeMode)) {
            view.setScaleType(ImageView.ScaleType.FIT_XY);
        } else if ("cover".equals(resizeMode)) {
            view.setScaleType(ImageView.ScaleType.CENTER_CROP);
        } else if ("center".equals(resizeMode)) {
            view.setScaleType(ImageView.ScaleType.CENTER);
        } else {
            view.setScaleType(ImageView.ScaleType.CENTER_CROP); // Default to cover
        }
    }

    @Override
    public void setWidth(ImageView view, int width) {
        if (width <= 0) {
            width = 100; // default 100
        }
        ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
        if (layoutParams != null) {
            layoutParams.width = width;
            view.setLayoutParams(layoutParams);
        }
    }

    @Override
    public void setHeight(ImageView view, int height) {
        if (height <= 0) {
            height = 100; // default 100
        }
        ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
        if (layoutParams != null) {
            layoutParams.height = height;
            view.setLayoutParams(layoutParams);
        }
    }

    @Override
    public void setTintColor(ImageView view, @Nullable String color) {
        if (color != null && !color.isEmpty()) {
            try {
                if (!color.startsWith("#") && color.length() == 6 && color.matches("[0-9A-Fa-f]+")) {
                    color = "#" + color;
                }
                int parsedColor = Color.parseColor(color);
                view.setColorFilter(new PorterDuffColorFilter(parsedColor, PorterDuff.Mode.SRC_IN));
            } catch (IllegalArgumentException e) {
                Log.e("BlastedViewManager", "Invalid color format: " + color);
            }
        } else {
            view.clearColorFilter();
        }
    }
}
