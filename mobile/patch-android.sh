#!/usr/bin/env bash
# يجهّز مشروع الأندرويد: شاشة بالعرض، ملء الشاشة، رقم النسخة، التوقيع
set -e
V="$1"; IFS=. read -r MA MI PA <<< "$V"; CODE=$((MA*10000 + MI*100 + PA))
M=android/app/src/main/AndroidManifest.xml
sed -i 's|android:name=".MainActivity"|android:name=".MainActivity"\n            android:screenOrientation="sensorLandscape"|' "$M"
G=android/app/build.gradle
sed -i "s/versionCode [0-9]*/versionCode $CODE/; s/versionName \"[^\"]*\"/versionName \"$V\"/" "$G"
cat >> "$G" <<'GR'

// توقيع النسخة (المفتاح بـ mobile/ أو من أسرار GitHub)
android {
    signingConfigs {
        ibra {
            storeFile file(System.getenv('KS_FILE'))
            storePassword System.getenv('KS_PASS')
            keyAlias System.getenv('KS_ALIAS')
            keyPassword System.getenv('KS_PASS')
        }
    }
    buildTypes { release { signingConfig signingConfigs.ibra; minifyEnabled false } }
}
GR
# ملء الشاشة (بدون شريط العنوان)
S=android/app/src/main/res/values/styles.xml
sed -i 's|<item name="android:background">@null</item>|<item name="android:background">@null</item>\n        <item name="android:windowFullscreen">true</item>|' "$S" || true
echo "android patched: $V ($CODE)"

# ---- التحديث الداخلي (ينزّل APK ويثبّته من داخل اللعبة) ----
J=android/app/src/main/java/com/ibraprogram/ibrarescue
cp mobile/android/IbraUpdatePlugin.java "$J/"
cat > "$J/MainActivity.java" <<'JV'
package com.ibraprogram.ibrarescue;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IbraUpdatePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
JV
mkdir -p android/app/src/main/res/xml
cat > android/app/src/main/res/xml/ibra_update_paths.xml <<'XP'
<?xml version="1.0" encoding="utf-8"?>
<paths><cache-path name="update" path="update/" /></paths>
XP
sed -i 's|<uses-permission android:name="android.permission.INTERNET" />|<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />|' "$M"
sed -i 's|</application>|    <provider android:name="androidx.core.content.FileProvider" android:authorities="${applicationId}.ibraupdate" android:exported="false" android:grantUriPermissions="true">\n            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/ibra_update_paths" />\n        </provider>\n    </application>|' "$M"
grep -q REQUEST_INSTALL_PACKAGES "$M" && grep -q ibraupdate "$M" && echo "in-app update patched"
