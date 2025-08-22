import React, { useState } from 'react';
import VisualMatchScreen from './VisualMatchScreen';
import MatchModal from '../components/MatchModal';
import useSwipeActions from '../hooks/useSwipeActions';
import { auth } from '../services/firebase';
import createOrGetChat from '../utils/createOrGetChat';
import { useRouter } from 'expo-router';
import { useProfileCheck } from '../hooks/useProfileCheck';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

// Sample user data for demonstration - 50 diverse Dutch profiles
const sampleUsers = [
  {
    id: '1',
    displayName: 'Sophie',
    birthDate: '1995-03-15',
    photos: [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    ],
    location: { city: 'Amsterdam', country: 'Netherlands' },
    profession: 'Marketing Manager',
    pronouns: 'she/her',
    bio: 'Passionate about travel and trying new cuisines. Looking for someone to share adventures with.',
    interests: ['travel', 'cooking', 'photography', 'hiking', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids in the future',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'A cozy dinner followed by a sunset walk',
      'travel-dream': 'Exploring the hidden gems of Japan',
      'simple-pleasure': 'Sunday morning coffee and a good book'
    }
  },
  {
    id: '2',
    displayName: 'Lucas',
    birthDate: '1992-07-22',
    photos: [
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'
    ],
    location: { city: 'Rotterdam', country: 'Netherlands' },
    profession: 'Software Engineer',
    pronouns: 'he/him',
    bio: 'Tech enthusiast who loves music and outdoor activities. Seeking a genuine connection.',
    interests: ['music', 'technology', 'guitar', 'fitness', 'hiking'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Live music and deep conversations',
      'travel-dream': 'Road trip across Europe',
      'simple-pleasure': 'Playing guitar on a quiet evening'
    }
  },
  {
    id: '3',
    displayName: 'Emma',
    birthDate: '1998-11-08',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg'
    ],
    location: { city: 'The Hague', country: 'Netherlands' },
    profession: 'Art Director',
    pronouns: 'she/her',
    bio: 'Creative soul who finds beauty in everyday moments. Looking for someone who values authenticity.',
    interests: ['art', 'fashion', 'museums', 'vintage', 'yoga'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Art gallery visit and wine tasting',
      'travel-dream': 'Exploring the art scene in Paris',
      'simple-pleasure': 'Morning yoga and meditation'
    }
  },
  {
    id: '4',
    displayName: 'David',
    birthDate: '1990-05-12',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Utrecht', country: 'Netherlands' },
    profession: 'Financial Analyst',
    pronouns: 'he/him',
    bio: 'Love for fitness and healthy living. Looking for someone to build a future together.',
    interests: ['fitness', 'cooking', 'travel', 'reading', 'sports'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Cooking together and watching movies',
      'travel-dream': 'Backpacking through South America',
      'simple-pleasure': 'Morning workout and smoothie'
    }
  },
  {
    id: '5',
    displayName: 'Lisa',
    birthDate: '1996-09-30',
    photos: [
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg'
    ],
    location: { city: 'Eindhoven', country: 'Netherlands' },
    profession: 'UX Designer',
    pronouns: 'she/her',
    bio: 'Creative problem solver who loves nature and good coffee. Seeking meaningful connections.',
    interests: ['design', 'coffee', 'hiking', 'photography', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Coffee shop and bookstore browsing',
      'travel-dream': 'Hiking in the Pacific Northwest',
            'simple-pleasure': 'Designing while listening to jazz'
    }
  },
  {
    id: '6',
    displayName: 'Thomas',
    birthDate: '1993-12-03',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Groningen', country: 'Netherlands' },
    profession: 'Doctor',
    pronouns: 'he/him',
    bio: 'Medical professional who loves cycling and reading. Looking for someone to share life\'s journey.',
    interests: ['cycling', 'reading', 'medicine', 'travel', 'cooking'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Bike ride and picnic in the park',
      'travel-dream': 'Cycling through the Netherlands',
      'simple-pleasure': 'Reading medical journals with coffee'
    }
  },
  {
    id: '7',
    displayName: 'Anna',
    birthDate: '1997-06-18',
    photos: [
      'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg'
    ],
    location: { city: 'Tilburg', country: 'Netherlands' },
    profession: 'Teacher',
    pronouns: 'she/her',
    bio: 'Passionate educator who loves art and nature. Seeking someone to grow together.',
    interests: ['teaching', 'art', 'nature', 'books', 'travel'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to a museum and coffee',
      'travel-dream': 'Teaching in different countries',
      'simple-pleasure': 'Reading children\'s books'
    }
  },
  {
    id: '8',
    displayName: 'Mark',
    birthDate: '1991-04-25',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Almere', country: 'Netherlands' },
    profession: 'Architect',
    pronouns: 'he/him',
    bio: 'Creative architect who designs buildings and dreams. Looking for someone to build a life together.',
    interests: ['architecture', 'design', 'photography', 'travel', 'art'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Walking tour of interesting buildings',
      'travel-dream': 'Visiting architectural wonders worldwide',
      'simple-pleasure': 'Sketching buildings in the city'
    }
  },
  {
    id: '9',
    displayName: 'Sarah',
    birthDate: '1994-08-14',
    photos: [
      'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    ],
    location: { city: 'Breda', country: 'Netherlands' },
    profession: 'Chef',
    pronouns: 'she/her',
    bio: 'Culinary artist who creates delicious experiences. Seeking someone to share food and life with.',
    interests: ['cooking', 'food', 'travel', 'wine', 'culture'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Cooking class and wine tasting',
      'travel-dream': 'Exploring world cuisines',
      'simple-pleasure': 'Creating new recipes'
    }
  },
  {
    id: '10',
    displayName: 'Alex',
    birthDate: '1996-01-30',
    photos: [
      'https://images.pexels.com/photos/582039/pexels-photo-582039.jpeg'
    ],
    location: { city: 'Nijmegen', country: 'Netherlands' },
    profession: 'Environmental Scientist',
    pronouns: 'they/them',
    bio: 'Nature lover working to protect the environment. Looking for someone who shares my passion for sustainability.',
    interests: ['environment', 'nature', 'hiking', 'science', 'photography'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Hike in nature reserve',
      'travel-dream': 'Studying ecosystems worldwide',
      'simple-pleasure': 'Bird watching in the park'
    }
  },
  {
    id: '11',
    displayName: 'Maria',
    birthDate: '1992-11-12',
    photos: [
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    ],
    location: { city: 'Haarlem', country: 'Netherlands' },
    profession: 'Nurse',
    pronouns: 'she/her',
    bio: 'Caring healthcare professional who loves helping others. Seeking someone to care for and grow with.',
    interests: ['healthcare', 'helping others', 'reading', 'travel', 'cooking'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Quiet dinner and conversation',
      'travel-dream': 'Volunteering in healthcare worldwide',
      'simple-pleasure': 'Reading medical books'
    }
  },
  {
    id: '12',
    displayName: 'Jasper',
    birthDate: '1995-02-28',
    photos: [
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'
    ],
    location: { city: 'Leiden', country: 'Netherlands' },
    profession: 'Researcher',
    pronouns: 'he/him',
    bio: 'Curious mind exploring the mysteries of science. Looking for someone to discover life with.',
    interests: ['research', 'science', 'reading', 'travel', 'coffee'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to a science museum',
      'travel-dream': 'Research collaboration worldwide',
      'simple-pleasure': 'Reading scientific papers'
    }
  },
  {
    id: '13',
    displayName: 'Eva',
    birthDate: '1998-07-04',
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    ],
    location: { city: 'Amersfoort', country: 'Netherlands' },
    profession: 'Student',
    pronouns: 'she/her',
    bio: 'Young student exploring life and learning. Seeking someone to grow and learn together.',
    interests: ['learning', 'travel', 'music', 'art', 'books'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Casual dating'],
    childrenPlan: 'Not sure yet',
    monogamy: 'Open to discussion',
    prompts: {
      'ideal-date': 'Study session and coffee',
      'travel-dream': 'Studying abroad',
      'simple-pleasure': 'Learning new languages'
    }
  },
  {
    id: '14',
    displayName: 'Daniel',
    birthDate: '1990-10-15',
    photos: [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
    ],
    location: { city: 'Arnhem', country: 'Netherlands' },
    profession: 'Police Officer',
    pronouns: 'he/him',
    bio: 'Dedicated public servant who protects and serves. Looking for someone to build a safe future with.',
    interests: ['public service', 'fitness', 'sports', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Walk in the park and coffee',
      'travel-dream': 'Exploring different cultures',
      'simple-pleasure': 'Morning workout'
    }
  },
  {
    id: '15',
    displayName: 'Sophia',
    birthDate: '1993-04-20',
    photos: [
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
    ],
    location: { city: 'Maastricht', country: 'Netherlands' },
    profession: 'Lawyer',
    pronouns: 'she/her',
    bio: 'Justice seeker who believes in fairness and equality. Seeking someone to build a just world together.',
    interests: ['law', 'justice', 'reading', 'travel', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Dinner and legal discussion',
      'travel-dream': 'Studying international law',
      'simple-pleasure': 'Reading legal cases'
    }
  },
  {
    id: '16',
    displayName: 'Liam',
    birthDate: '1994-09-08',
    photos: [
      'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg'
    ],
    location: { city: 'Zwolle', country: 'Netherlands' },
    profession: 'Firefighter',
    pronouns: 'he/him',
    bio: 'Brave hero who saves lives and protects communities. Looking for someone to protect and love.',
    interests: ['firefighting', 'fitness', 'sports', 'travel', 'cooking'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Adventure sports and dinner',
      'travel-dream': 'Firefighting training worldwide',
      'simple-pleasure': 'Morning workout routine'
    }
  },
  {
    id: '17',
    displayName: 'Isabella',
    birthDate: '1996-12-25',
    photos: [
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
    ],
    location: { city: 'Dordrecht', country: 'Netherlands' },
    profession: 'Fashion Designer',
    pronouns: 'she/her',
    bio: 'Creative fashionista who designs beautiful clothes. Seeking someone to style life together.',
    interests: ['fashion', 'design', 'art', 'travel', 'shopping'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Fashion show and dinner',
      'travel-dream': 'Fashion weeks worldwide',
      'simple-pleasure': 'Sketching new designs'
    }
  },
  {
    id: '18',
    displayName: 'Noah',
    birthDate: '1991-03-17',
    photos: [
      'https://images.pexels.com/photos/3424799/pexels-photo-3424799.jpeg'
    ],
    location: { city: 'Leeuwarden', country: 'Netherlands' },
    profession: 'Pilot',
    pronouns: 'he/him',
    bio: 'Sky explorer who flies around the world. Looking for someone to soar through life together.',
    interests: ['aviation', 'travel', 'geography', 'photography', 'fitness'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Flight simulator and dinner',
      'travel-dream': 'Flying to every continent',
      'simple-pleasure': 'Studying flight maps'
    }
  },
  {
    id: '19',
    displayName: 'Mia',
    birthDate: '1997-05-22',
    photos: [
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg'
    ],
    location: { city: 'Venlo', country: 'Netherlands' },
    profession: 'Veterinarian',
    pronouns: 'she/her',
    bio: 'Animal lover who heals and cares for pets. Seeking someone to share love for animals.',
    interests: ['animals', 'veterinary medicine', 'nature', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to animal shelter',
      'travel-dream': 'Veterinary work worldwide',
      'simple-pleasure': 'Caring for animals'
    }
  },
  {
    id: '20',
    displayName: 'William',
    birthDate: '1993-11-30',
    photos: [
      'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg'
    ],
    location: { city: 'Helmond', country: 'Netherlands' },
    profession: 'Electrician',
    pronouns: 'he/him',
    bio: 'Skilled tradesman who fixes electrical problems. Looking for someone to light up life together.',
    interests: ['electrical work', 'DIY', 'sports', 'travel', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'DIY project and dinner',
      'travel-dream': 'Learning electrical systems worldwide',
      'simple-pleasure': 'Fixing things around the house'
    }
  },
  {
    id: '21',
    displayName: 'Ava',
    birthDate: '1995-08-14',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg'
    ],
    location: { city: 'Alkmaar', country: 'Netherlands' },
    profession: 'Baker',
    pronouns: 'she/her',
    bio: 'Sweet baker who creates delicious pastries. Seeking someone to share sweet moments with.',
    interests: ['baking', 'cooking', 'food', 'art', 'travel'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Baking class and coffee',
      'travel-dream': 'Learning baking techniques worldwide',
      'simple-pleasure': 'Creating new recipes'
    }
  },
  {
    id: '22',
    displayName: 'James',
    birthDate: '1992-01-07',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Delft', country: 'Netherlands' },
    profession: 'Engineer',
    pronouns: 'he/him',
    bio: 'Problem solver who builds and creates. Looking for someone to engineer life together.',
    interests: ['engineering', 'technology', 'building', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to engineering museum',
      'travel-dream': 'Engineering projects worldwide',
      'simple-pleasure': 'Solving technical problems'
    }
  },
  {
    id: '23',
    displayName: 'Charlotte',
    birthDate: '1996-06-19',
    photos: [
      'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg'
    ],
    location: { city: 'Schiedam', country: 'Netherlands' },
    profession: 'Dentist',
    pronouns: 'she/her',
    bio: 'Oral health professional who cares for smiles. Seeking someone to share beautiful smiles with.',
    interests: ['dental health', 'helping others', 'travel', 'reading', 'cooking'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Dinner and health discussion',
      'travel-dream': 'Dental mission trips worldwide',
      'simple-pleasure': 'Reading dental journals'
    }
  },
  {
    id: '24',
    displayName: 'Benjamin',
    birthDate: '1991-12-11',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Roosendaal', country: 'Netherlands' },
    profession: 'Musician',
    pronouns: 'he/him',
    bio: 'Creative artist who makes beautiful music. Looking for someone to harmonize life with.',
    interests: ['music', 'art', 'creativity', 'travel', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Live music and dinner',
      'travel-dream': 'Performing worldwide',
      'simple-pleasure': 'Playing instruments'
    }
  },
  {
    id: '25',
    displayName: 'Harper',
    birthDate: '1997-03-28',
    photos: [
      'https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg'
    ],
    location: { city: 'Lelystad', country: 'Netherlands' },
    profession: 'Journalist',
    pronouns: 'she/her',
    bio: 'Storyteller who uncovers truth and shares stories. Seeking someone to write life\'s story together.',
    interests: ['journalism', 'writing', 'travel', 'reading', 'photography'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Coffee and story sharing',
      'travel-dream': 'Reporting from worldwide locations',
      'simple-pleasure': 'Writing articles'
    }
  },
  {
    id: '26',
    displayName: 'Ethan',
    birthDate: '1994-07-16',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Zoetermeer', country: 'Netherlands' },
    profession: 'Photographer',
    pronouns: 'he/him',
    bio: 'Visual artist who captures life\'s beautiful moments. Looking for someone to photograph life together.',
    interests: ['photography', 'art', 'travel', 'nature', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Photo walk and coffee',
      'travel-dream': 'Photographing worldwide landscapes',
      'simple-pleasure': 'Editing photos'
    }
  },
  {
    id: '27',
    displayName: 'Scarlett',
    birthDate: '1996-02-09',
    photos: [
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ],
    location: { city: 'Emmen', country: 'Netherlands' },
    profession: 'Psychologist',
    pronouns: 'she/her',
    bio: 'Mental health professional who helps people heal. Seeking someone to grow emotionally together.',
    interests: ['psychology', 'helping others', 'reading', 'travel', 'yoga'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Deep conversation and coffee',
      'travel-dream': 'Studying psychology worldwide',
      'simple-pleasure': 'Reading psychology books'
    }
  },
  {
    id: '28',
    displayName: 'Mason',
    birthDate: '1992-10-03',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Alphen aan den Rijn', country: 'Netherlands' },
    profession: 'Plumber',
    pronouns: 'he/him',
    bio: 'Skilled tradesman who fixes water problems. Looking for someone to flow through life together.',
    interests: ['plumbing', 'DIY', 'sports', 'travel', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'DIY project and dinner',
      'travel-dream': 'Learning plumbing worldwide',
      'simple-pleasure': 'Fixing things around the house'
    }
  },
  {
    id: '29',
    displayName: 'Luna',
    birthDate: '1998-04-12',
    photos: [
      'https://images.pexels.com/photos/3424799/pexels-photo-3424799.jpeg'
    ],
    location: { city: 'Bergen op Zoom', country: 'Netherlands' },
    profession: 'Student',
    pronouns: 'she/her',
    bio: 'Young learner exploring life and education. Seeking someone to grow and learn together.',
    interests: ['learning', 'travel', 'music', 'art', 'books'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Casual dating'],
    childrenPlan: 'Not sure yet',
    monogamy: 'Open to discussion',
    prompts: {
      'ideal-date': 'Study session and coffee',
      'travel-dream': 'Studying abroad',
      'simple-pleasure': 'Learning new languages'
    }
  },
  {
    id: '30',
    displayName: 'Oliver',
    birthDate: '1991-06-25',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Gouda', country: 'Netherlands' },
    profession: 'Cheese Maker',
    pronouns: 'he/him',
    bio: 'Traditional artisan who creates delicious cheese. Looking for someone to savor life together.',
    interests: ['cheese making', 'traditional crafts', 'food', 'travel', 'culture'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Cheese tasting and wine',
      'travel-dream': 'Learning cheese making worldwide',
      'simple-pleasure': 'Creating new cheese varieties'
    }
  },
  {
    id: '31',
    displayName: 'Eva',
    birthDate: '1994-07-16',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Zoetermeer', country: 'Netherlands' },
    profession: 'Photographer',
    pronouns: 'he/him',
    bio: 'Visual artist who captures life\'s beautiful moments. Looking for someone to photograph life together.',
    interests: ['photography', 'art', 'travel', 'nature', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Photo walk and coffee',
      'travel-dream': 'Photographing worldwide landscapes',
      'simple-pleasure': 'Editing photos'
    }
  },
  {
    id: '32',
    displayName: 'Scarlett',
    birthDate: '1996-02-09',
    photos: [
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ],
    location: { city: 'Emmen', country: 'Netherlands' },
    profession: 'Psychologist',
    pronouns: 'she/her',
    bio: 'Mental health professional who helps people heal. Seeking someone to grow emotionally together.',
    interests: ['psychology', 'helping others', 'reading', 'travel', 'yoga'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Deep conversation and coffee',
      'travel-dream': 'Studying psychology worldwide',
      'simple-pleasure': 'Reading psychology books'
    }
  },
  {
    id: '33',
    displayName: 'Mason',
    birthDate: '1992-10-03',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Alphen aan den Rijn', country: 'Netherlands' },
    profession: 'Plumber',
    pronouns: 'he/him',
    bio: 'Skilled tradesman who fixes water problems. Looking for someone to flow through life together.',
    interests: ['plumbing', 'DIY', 'sports', 'travel', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'DIY project and dinner',
      'travel-dream': 'Learning plumbing worldwide',
      'simple-pleasure': 'Fixing things around the house'
    }
  },
  {
    id: '34',
    displayName: 'Ava',
    birthDate: '1995-08-14',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg'
    ],
    location: { city: 'Alkmaar', country: 'Netherlands' },
    profession: 'Baker',
    pronouns: 'she/her',
    bio: 'Sweet baker who creates delicious pastries. Seeking someone to share sweet moments with.',
    interests: ['baking', 'cooking', 'food', 'art', 'travel'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Baking class and coffee',
      'travel-dream': 'Learning baking techniques worldwide',
      'simple-pleasure': 'Creating new recipes'
    }
  },
  {
    id: '35',
    displayName: 'James',
    birthDate: '1992-01-07',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Delft', country: 'Netherlands' },
    profession: 'Engineer',
    pronouns: 'he/him',
    bio: 'Problem solver who builds and creates. Looking for someone to engineer life together.',
    interests: ['engineering', 'technology', 'building', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to engineering museum',
      'travel-dream': 'Engineering projects worldwide',
      'simple-pleasure': 'Solving technical problems'
    }
  },
  {
    id: '36',
    displayName: 'Grace',
    birthDate: '1995-11-08',
    photos: [
      'https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg'
    ],
    location: { city: 'Spijkenisse', country: 'Netherlands' },
    profession: 'Dance Teacher',
    pronouns: 'she/her',
    bio: 'Rhythmic artist who teaches movement and expression. Seeking someone to dance through life together.',
    interests: ['dance', 'music', 'art', 'teaching', 'travel'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Dance class and dinner',
      'travel-dream': 'Teaching dance worldwide',
      'simple-pleasure': 'Practicing dance moves'
    }
  },
  {
    id: '37',
    displayName: 'Henry',
    birthDate: '1993-05-14',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Capelle aan den IJssel', country: 'Netherlands' },
    profession: 'Accountant',
    pronouns: 'he/him',
    bio: 'Financial professional who loves numbers and organization. Looking for someone to balance life together.',
    interests: ['accounting', 'finance', 'organization', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Dinner and financial planning',
      'travel-dream': 'Studying finance worldwide',
      'simple-pleasure': 'Organizing spreadsheets'
    }
  },
  {
    id: '38',
    displayName: 'Chloe',
    birthDate: '1997-09-22',
    photos: [
      'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg'
    ],
    location: { city: 'Hilversum', country: 'Netherlands' },
    profession: 'TV Producer',
    pronouns: 'she/her',
    bio: 'Creative media professional who tells stories through television. Seeking someone to produce life together.',
    interests: ['media', 'television', 'storytelling', 'travel', 'art'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'TV show filming and dinner',
      'travel-dream': 'Producing shows worldwide',
      'simple-pleasure': 'Creating storyboards'
    }
  },
  {
    id: '39',
    displayName: 'Sebastian',
    birthDate: '1990-12-05',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Nieuwegein', country: 'Netherlands' },
    profession: 'Carpenter',
    pronouns: 'he/him',
    bio: 'Skilled craftsman who builds with wood and love. Looking for someone to construct life together.',
    interests: ['carpentry', 'woodworking', 'building', 'travel', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Woodworking project and dinner',
      'travel-dream': 'Learning carpentry worldwide',
      'simple-pleasure': 'Building furniture'
    }
  },
  {
    id: '40',
    displayName: 'Luna',
    birthDate: '1998-04-12',
    photos: [
      'https://images.pexels.com/photos/3424799/pexels-photo-3424799.jpeg'
    ],
    location: { city: 'Bergen op Zoom', country: 'Netherlands' },
    profession: 'Student',
    pronouns: 'she/her',
    bio: 'Young learner exploring life and education. Seeking someone to grow and learn together.',
    interests: ['learning', 'travel', 'music', 'art', 'books'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Casual dating'],
    childrenPlan: 'Not sure yet',
    monogamy: 'Open to discussion',
    prompts: {
      'ideal-date': 'Study session and coffee',
      'travel-dream': 'Studying abroad',
      'simple-pleasure': 'Learning new languages'
    }
  },
  {
    id: '41',
    displayName: 'Oliver',
    birthDate: '1991-06-25',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Gouda', country: 'Netherlands' },
    profession: 'Cheese Maker',
    pronouns: 'he/him',
    bio: 'Traditional artisan who creates delicious cheese. Looking for someone to savor life together.',
    interests: ['cheese making', 'traditional crafts', 'food', 'travel', 'culture'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Cheese tasting and wine',
      'travel-dream': 'Learning cheese making worldwide',
      'simple-pleasure': 'Creating new cheese varieties'
    }
  },
  {
    id: '42',
    displayName: 'Eva',
    birthDate: '1994-07-16',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Zoetermeer', country: 'Netherlands' },
    profession: 'Photographer',
    pronouns: 'he/him',
    bio: 'Visual artist who captures life\'s beautiful moments. Looking for someone to photograph life together.',
    interests: ['photography', 'art', 'travel', 'nature', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Photo walk and coffee',
      'travel-dream': 'Photographing worldwide landscapes',
      'simple-pleasure': 'Editing photos'
    }
  },
  {
    id: '43',
    displayName: 'Scarlett',
    birthDate: '1996-02-09',
    photos: [
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ],
    location: { city: 'Emmen', country: 'Netherlands' },
    profession: 'Psychologist',
    pronouns: 'she/her',
    bio: 'Mental health professional who helps people heal. Seeking someone to grow emotionally together.',
    interests: ['psychology', 'helping others', 'reading', 'travel', 'yoga'],
    smoking: 'never',
    drinking: 'occasionally',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Deep conversation and coffee',
      'travel-dream': 'Studying psychology worldwide',
      'simple-pleasure': 'Reading psychology books'
    }
  },
  {
    id: '44',
    displayName: 'Mason',
    birthDate: '1992-10-03',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Alphen aan den Rijn', country: 'Netherlands' },
    profession: 'Plumber',
    pronouns: 'he/him',
    bio: 'Skilled tradesman who fixes water problems. Looking for someone to flow through life together.',
    interests: ['plumbing', 'DIY', 'sports', 'travel', 'music'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'DIY project and dinner',
      'travel-dream': 'Learning plumbing worldwide',
      'simple-pleasure': 'Fixing things around the house'
    }
  },
  {
    id: '45',
    displayName: 'Ava',
    birthDate: '1995-08-14',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg'
    ],
    location: { city: 'Alkmaar', country: 'Netherlands' },
    profession: 'Baker',
    pronouns: 'she/her',
    bio: 'Sweet baker who creates delicious pastries. Seeking someone to share sweet moments with.',
    interests: ['baking', 'cooking', 'food', 'art', 'travel'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Baking class and coffee',
      'travel-dream': 'Learning baking techniques worldwide',
      'simple-pleasure': 'Creating new recipes'
    }
  },
  {
    id: '46',
    displayName: 'James',
    birthDate: '1992-01-07',
    photos: [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    ],
    location: { city: 'Delft', country: 'Netherlands' },
    profession: 'Engineer',
    pronouns: 'he/him',
    bio: 'Problem solver who builds and creates. Looking for someone to engineer life together.',
    interests: ['engineering', 'technology', 'building', 'travel', 'reading'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Serious relationship'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Visit to engineering museum',
      'travel-dream': 'Engineering projects worldwide',
      'simple-pleasure': 'Solving technical problems'
    }
  },
  {
    id: '47',
    displayName: 'Charlotte',
    birthDate: '1996-06-19',
    photos: [
      'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg'
    ],
    location: { city: 'Schiedam', country: 'Netherlands' },
    profession: 'Dentist',
    pronouns: 'she/her',
    bio: 'Oral health professional who cares for smiles. Seeking someone to share beautiful smiles with.',
    interests: ['dental health', 'helping others', 'travel', 'reading', 'cooking'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'regularly',
    relationshipGoals: ['Marriage', 'Long-term relationship'],
    childrenPlan: 'Wants kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Dinner and health discussion',
      'travel-dream': 'Dental mission trips worldwide',
      'simple-pleasure': 'Reading dental journals'
    }
  },
  {
    id: '48',
    displayName: 'Benjamin',
    birthDate: '1991-12-11',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
    ],
    location: { city: 'Roosendaal', country: 'Netherlands' },
    profession: 'Musician',
    pronouns: 'he/him',
    bio: 'Creative artist who makes beautiful music. Looking for someone to harmonize life with.',
    interests: ['music', 'art', 'creativity', 'travel', 'coffee'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Live music and dinner',
      'travel-dream': 'Performing worldwide',
      'simple-pleasure': 'Playing instruments'
    }
  },
  {
    id: '49',
    displayName: 'Harper',
    birthDate: '1997-03-28',
    photos: [
      'https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg'
    ],
    location: { city: 'Lelystad', country: 'Netherlands' },
    profession: 'Journalist',
    pronouns: 'she/her',
    bio: 'Storyteller who uncovers truth and shares stories. Seeking someone to write life\'s story together.',
    interests: ['journalism', 'writing', 'travel', 'reading', 'photography'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Wants kids someday',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Coffee and story sharing',
      'travel-dream': 'Reporting from worldwide locations',
      'simple-pleasure': 'Writing articles'
    }
  },
  {
    id: '50',
    displayName: 'Leo',
    birthDate: '1994-12-03',
    photos: [
      'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg'
    ],
    location: { city: 'Tilburg', country: 'Netherlands' },
    profession: 'Artist',
    pronouns: 'he/him',
    bio: 'Creative soul who paints life\'s colors. Looking for someone to create art together.',
    interests: ['art', 'painting', 'creativity', 'travel', 'museums'],
    smoking: 'never',
    drinking: 'socially',
    exercise: 'light',
    relationshipGoals: ['Long-term relationship', 'Marriage'],
    childrenPlan: 'Open to having kids',
    monogamy: 'Monogamous',
    prompts: {
      'ideal-date': 'Art gallery visit and coffee',
      'travel-dream': 'Exhibiting art worldwide',
      'simple-pleasure': 'Painting in the studio'
    }
  }
];

export default function VisualMatchPage() {
  const router = useRouter();
  const { isLoading: isProfileChecking, hasProfile } = useProfileCheck();
  const [isLoading, setIsLoading] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUserPhoto, setMatchedUserPhoto] = useState('');
  const [matchedUserId, setMatchedUserId] = useState('');
  const currentUserId = auth.currentUser?.uid;
  
  // Get current user photo (first photo from sample data for demo)
  const currentUserPhoto = sampleUsers[0]?.photos?.[0] || '';
  
  // Define the match handler
  const handleMatch = (matchedUserId: string) => {
    const matchedUser = sampleUsers.find(u => u.id === matchedUserId);
    if (matchedUser) {
      setMatchedUserPhoto(matchedUser.photos?.[0] || '');
      setMatchedUserId(matchedUserId);
      setShowMatchModal(true);
    }
  };
  
  // Use the Firebase swipe actions hook with match callback
  const { onSwipeRight, onSwipeLeft } = useSwipeActions(currentUserId || '', handleMatch);
  
  const handleSwipeRight = async (userId: string) => {
    try {
      if (!currentUserId) {
        console.log('No current user ID, skipping Firebase write');
        return;
      }
      
      await onSwipeRight(userId);
      console.log('✅ Like stored in Firebase for user:', userId);
    } catch (error) {
      console.error('❌ Failed to store like in Firebase:', error);
    }
  };

  const handleSwipeLeft = async (userId: string) => {
    try {
      if (!currentUserId) {
        console.log('No current user ID, skipping Firebase write');
        return;
      }
      
      await onSwipeLeft(userId);
      console.log('✅ Pass stored in Firebase for user:', userId);
    } catch (error) {
      console.error('❌ Failed to store pass in Firebase:', error);
    }
  };

  if (isProfileChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={{ marginTop: spacing.md, ...typography.styles.body, color: colors.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!hasProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...typography.styles.body, color: colors.text.secondary }}>
          Please create your profile first
        </Text>
      </View>
    );
  }

  return (
    <>
      <VisualMatchScreen
        users={sampleUsers}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        isLoading={isLoading}
      />
      
      <MatchModal
        isVisible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onStartChat={async (chatId) => {
          try {
            if (!currentUserId || !matchedUserId) {
              console.error('Missing user IDs for chat creation');
              return;
            }

            console.log('💬 Creating chat between:', currentUserId, 'and', matchedUserId);
            
            // Create or get chat
            const newChatId = await createOrGetChat(currentUserId, matchedUserId);
            
            console.log('✅ Chat created/retrieved:', newChatId);
            
            // Navigate to chat screen
            router.push(`/chat/${newChatId}`);
            
            // Close the modal
            setShowMatchModal(false);
          } catch (error) {
            console.error('❌ Error creating chat:', error);
            // You could show an alert here if needed
          }
        }}
        currentUserPhoto={currentUserPhoto}
        matchedUserPhoto={matchedUserPhoto}
      />
    </>
  );
} 