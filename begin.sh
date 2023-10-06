rm -f ./node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m
cp ./temp/RCTUIImageViewAnimated.m ./node_modules/react-native/Libraries/Image

# rm -f ./node_modules/react-native-image-picker/android/src/main/java/com/imagepicker/ImagePickerModule.java
# cp ./temp/ImagePickerModule.java ./node_modules/react-native-image-picker/android/src/main/java/com/imagepicker

rm -f ./node_modules/rn-tourguide/lib/components/TourGuideProvider.js
cp ./temp/TourGuideProvider.js ./node_modules/rn-tourguide/lib/components

rm -f ./node_modules/react-native-video/android-exoplayer/src/main/java/com/brentvatne/exoplayer/AndroidCacheDataSourceFactory.java
cp ./temp/AndroidCacheDataSourceFactory.java ./node_modules/react-native-video/android-exoplayer/src/main/java/com/brentvatne/exoplayer
