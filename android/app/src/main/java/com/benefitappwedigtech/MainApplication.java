package com.benefitappwedigtech;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.RNPlayAudio.RNPlayAudioPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.facebook.react.ReactApplication;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.filepicker.FilePickerPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.imagepicker.ImagePickerPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNOuiPedometerPackage;
import com.reactnative.googlefit.GoogleFitPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.rnfs.RNFSPackage;
import com.rpt.reactnativecheckpackageinstallation.CheckPackageInstallationPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAccountKitPackage(),
            new MPAndroidChartPackage(),
            new FBSDKPackage(),
            new RNGoogleSigninPackage(),
            new BackgroundTaskPackage(),
           // new GoogleFitPackage(),
            new RNOuiPedometerPackage(),
            new RNPlayAudioPackage(),
            new FingerprintAuthPackage(),
            new RNSharePackage(),
            new RNCardViewPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new RNSqlite2Package(),
            new SplashScreenReactPackage(),
            new SnackbarPackage(),
            new ReactNativeRestartPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new RNFSPackage(),
            new RNFirebasePackage(),
            new FilePickerPackage(),
            new RNDeviceInfo(),
            new CheckPackageInstallationPackage(),
            new NetInfoPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseMessagingPackage(),// <-- Add this line
         //  new GoogleFitPackage(MainActivity.activity),
           new GoogleFitPackage(BuildConfig.APPLICATION_ID)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    BackgroundTaskPackage.useContext(this);
  }
}
