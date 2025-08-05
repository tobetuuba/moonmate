import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface MatchModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStartChat: () => void;
  currentUserPhoto: string;
  matchedUserPhoto: string;
}

const { width, height } = Dimensions.get('window');

export default function MatchModal({
  isVisible,
  onClose,
  onStartChat,
  currentUserPhoto,
  matchedUserPhoto,
}: MatchModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const photoScale = useSharedValue(0.5);
  const photoRotation = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Animate in
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
        mass: 1,
      });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Animate photos with delay
      setTimeout(() => {
        photoScale.value = withSpring(1, {
          damping: 12,
          stiffness: 120,
          mass: 0.8,
        });
        photoRotation.value = withSpring(360, {
          damping: 15,
          stiffness: 100,
          mass: 1,
        });
      }, 200);
    } else {
      // Animate out
      scale.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
        mass: 1,
      });
      opacity.value = withTiming(0, { duration: 200 });
      photoScale.value = withSpring(0.5, {
        damping: 12,
        stiffness: 120,
        mass: 0.8,
      });
      photoRotation.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
        mass: 1,
      });
    }
  }, [isVisible]);

  const modalStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const photoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: photoScale.value },
        { rotate: `${photoRotation.value}deg` },
      ],
    };
  });

  const handleStartChat = () => {
    onStartChat();
    onClose();
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, modalStyle]}>
        <Animated.View style={[styles.card, cardStyle]}>
          <LinearGradient
            colors={['#FF6B9D', '#C44569', '#8B5FBF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Ionicons name="heart" size={32} color="#fff" />
              <Text style={styles.title}>✨ It's a Match! ✨</Text>
              <Ionicons name="heart" size={32} color="#fff" />
            </View>

            {/* Photos Container */}
            <Animated.View style={[styles.photosContainer, photoStyle]}>
              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: currentUserPhoto }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.photoBorder} />
              </View>

              <View style={styles.matchIcon}>
                <Ionicons name="heart" size={24} color="#FF6B9D" />
              </View>

              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: matchedUserPhoto }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.photoBorder} />
              </View>
            </Animated.View>

            {/* Message */}
            <Text style={styles.message}>
              You and your match liked each other! 🎉
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.startChatButton}
                onPress={handleStartChat}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="chatbubble" size={20} color="#fff" />
                  <Text style={styles.startChatText}>Start Chat</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keepSwipingButton}
                onPress={handleKeepSwiping}
                activeOpacity={0.8}
              >
                <Text style={styles.keepSwipingText}>Keep Swiping</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  cardGradient: {
    padding: 32,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  photoBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  matchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  startChatButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  startChatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  keepSwipingButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  keepSwipingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 