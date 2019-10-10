package com.benefitappwedigtech;


import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

public class StepSensor implements SensorEventListener {

    private static final String TAG = "StepCounter";
    private Activity activity;
    private ReactContext mReactContext;
    private android.hardware.SensorManager mSensorManager;
    private Sensor mStepCounter;
    private long lastUpdate = 0;
    private int delay;

    public StepSensor(ReactContext reactContext, Activity activity) {
        this.mReactContext = reactContext;
        this.activity = activity;

        boolean stepCounter = hasStepCounter();
        Log.i(TAG, "hasStepCounter: " + stepCounter);

        if (stepCounter) {
            mSensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
        }
    }

    public boolean hasStepCounter() {

        PackageManager pm = activity.getPackageManager();

        int currentApiVersion = Build.VERSION.SDK_INT;
        // Check that the device supports the step counter and detector sensors
        return currentApiVersion >= 19
                && pm.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_COUNTER)
                && pm.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_DETECTOR);

    }

    public int start(int delay) {
        List<Sensor> l = mSensorManager.getSensorList(Sensor.TYPE_ALL);

        this.delay = delay;
        if ((mStepCounter = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)) != null) {
            mSensorManager.registerListener(this, mStepCounter, android.hardware.SensorManager.SENSOR_DELAY_FASTEST);
            return (1);
        }
        return (0);
    }


    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Sensor mySensor = sensorEvent.sensor;

        Log.i(TAG, "onSensorChanged");


        if (mySensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            WritableMap map = Arguments.createMap();

            long curTime = System.currentTimeMillis();
            //i++;
            if ((curTime - lastUpdate) > delay) {
                final Object o = sensorEvent.values[0];
                Log.i("History", "Data point:" + sensorEvent.values[0]);

                map.putDouble("steps", sensorEvent.values[0]);
                sendEvent(this.mReactContext, "StepSensorChangedEvent", map);

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(mReactContext.getApplicationContext(), "" + o, Toast.LENGTH_SHORT).show();
                    }
                });
                lastUpdate = curTime;
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}