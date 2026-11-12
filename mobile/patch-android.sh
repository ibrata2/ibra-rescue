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
