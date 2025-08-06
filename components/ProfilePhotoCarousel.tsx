import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

const { width: screenWidth } = Dimensions.get('window');
const PHOTO_WIDTH = screenWidth - spacing.md * 2;
const PHOTO_HEIGHT = PHOTO_WIDTH * 1.2; // 5:6 aspect ratio

interface ProfilePhotoCarouselProps {
  photos: string[];
  isOwnProfile?: boolean;
  onAddPhoto?: () => void;
  onPhotoPress?: (photoUrl: string, index: number) => void;
}

export default function ProfilePhotoCarousel({
  photos,
  isOwnProfile = false,
  onAddPhoto,
  onPhotoPress,
}: ProfilePhotoCarouselProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const allPhotos = isOwnProfile && photos.length === 0 
    ? [{ id: 'add', url: '' }] 
    : photos.map((url, index) => ({ id: index.toString(), url }));

  const handlePhotoPress = (photoUrl: string, index: number) => {
    // Check if this is the "Add Photo" button (only shown when no photos exist)
    if (isOwnProfile && photos.length === 0 && index === 0) {
      onAddPhoto?.();
      return;
    }
    
    if (photoUrl) {
      setSelectedPhoto(photoUrl);
      onPhotoPress?.(photoUrl, index);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / PHOTO_WIDTH);
    setCurrentIndex(index);
  };

  const renderPhoto = (photo: { id: string; url: string }, index: number) => {
    const isAddPhoto = isOwnProfile && photos.length === 0 && index === 0;

    return (
      <TouchableOpacity
        key={photo.id}
        style={styles.photoContainer}
        onPress={() => handlePhotoPress(photo.url, index)}
        activeOpacity={0.9}
        accessibilityLabel={isAddPhoto ? "Add photo" : `Photo ${index + 1}`}
        accessibilityRole="button"
      >
        {isAddPhoto ? (
          <View style={styles.addPhotoContainer}>
            <Ionicons name="add-circle" size={48} color={colors.primary[500]} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </View>
        ) : (
          <Image
            source={{ uri: photo.url }}
            style={styles.photo}
            resizeMode="cover"
            accessibilityLabel={`Profile photo ${index + 1}`}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderPaginationDot = (index: number) => {
    const isActive = index === currentIndex;
    const scale = useSharedValue(isActive ? 1.2 : 1);
    const opacity = useSharedValue(isActive ? 1 : 0.5);

    React.useEffect(() => {
      scale.value = withSpring(isActive ? 1.2 : 1, { damping: 15 });
      opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 200 });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        key={index}
        style={[
          styles.paginationDot,
          isActive && styles.paginationDotActive,
          animatedStyle,
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Profile photos carousel"
      >
        {allPhotos.map((photo, index) => renderPhoto(photo, index))}
      </ScrollView>

      {/* Pagination Dots */}
      {allPhotos.length > 1 && (
        <View style={styles.paginationContainer}>
          {allPhotos.map((_, index) => renderPaginationDot(index))}
        </View>
      )}

      {/* Full Screen Modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedPhoto(null)}
            accessibilityLabel="Close photo viewer"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              style={styles.modalPhoto}
              resizeMode="contain"
              accessibilityLabel="Full screen profile photo"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  photoContainer: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    marginHorizontal: spacing.xs,
    borderRadius: spacing.card.borderRadius,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderStyle: 'dashed',
  },
  addPhotoText: {
    ...typography.styles.body,
    color: colors.primary[500],
    marginTop: spacing.sm,
    fontWeight: typography.weights.semibold,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: colors.primary[500],
    width: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: spacing.layout.header,
    right: spacing.md,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPhoto: {
    width: screenWidth,
    height: screenWidth,
  },
}); 