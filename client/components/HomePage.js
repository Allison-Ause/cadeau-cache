import {
  useToast,
  Box,
  Flex,
  Stack,
  Text,
  Link,
} from '@chakra-ui/react';
import { Navigate, Link as RLink } from 'react-router-dom';
import { useUser } from '../context/userContext.js';
import useGifts from '../hooks/useGifts.js';
import Gift from './Gift.js';
import NewGiftForm from './NewGiftForm.js';
import styles from '../global.css';
import Header from './Header.js';
import Loader from './Loader.js';
import {
  checkUpcomingBirthdays,
  fiveRecentGifts,
  formatDateMD,
  upcomingDates,
  makeToast,
} from '../services/general-utils.js';
import useFriends from '../hooks/useFriends.js';
import { useEffect } from 'react';

export default function HomePage() {
  const { gifts, setGifts } = useGifts();
  const { user, loading } = useUser();
  const { friends, friendsLoading } = useFriends(null, user);
  const toast = useToast();
  const oneHourInMS = 60 * 60 * 1000;

  const runOnce = () => {
    checkUpcomingBirthdays(friends).forEach(
      makeToast.bind(null, toast)
    );
  };

  useEffect(() => {
    if (friendsLoading) return;
    runOnce();
    const interval = setInterval(runOnce, oneHourInMS);
    return () => clearInterval(interval);
  }, [friendsLoading]);

  if (!loading && !user)
    return <Navigate to="/auth/sign-in" replace />;

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: '10px', md: '50px' }}
          className={styles.bg}
          backgroundPosition="bottom-left"
          backgroundSize="cover"
          h={{ base: '100%vh', md: 'calc(100vh)' }}
          padding={{ base: '5px', md: '30px' }}
          alignItems="center"
          justifyContent={{ base: 'center', md: 'space-around' }}
        >
          <NewGiftForm gift={{}} setGifts={setGifts} />
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={{ base: '15px', md: '50px' }}
          >
            <Box
              boxShadow="lg"
              p="6"
              rounded="lg"
              bg="#fff9ec"
              w={{ base: '300px', md: '425px' }}
              // h="350px"
              mt={{ base: '15px', md: '0px' }}
            >
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <h1 className={styles.title}>Recent Ideas</h1>
                <Stack spacing={1} mt="20px">
                  {fiveRecentGifts(gifts).map((gift) => (
                    <Flex
                      key={gift.id}
                      gap="5px"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Gift
                        key={gift.id}
                        gift={gift}
                        setGifts={setGifts}
                      />
                    </Flex>
                  ))}
                </Stack>
              </Flex>
            </Box>
            <Box
              boxShadow="lg"
              p="6"
              rounded="lg"
              bg="#fff9ec"
              w={{ base: '300px', md: '425px' }}
              h={{ base: '450px', md: '300px' }}
              mt={{ base: '10px', md: '0px' }}
              mb={{ base: '25px', md: '0px' }}
            >
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <h1 className={styles.title}>Coming Up</h1>
                <Stack spacing={3} mt="20px">
                  {upcomingDates(friends)
                    .slice(0, 5)
                    .map((friend) => (
                      <Flex
                        key={friend.id}
                        direction={{ base: 'column', md: 'row' }}
                        gap={{ base: '0px', md: '5px' }}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontWeight="bold">
                          {formatDateMD(friend.birthday)}
                        </Text>
                        <Text>
                          <Link
                            as={RLink}
                            to={`/friends/${friend.id}`}
                          >{`- ${friend.name}'s`}</Link>
                          {` Birthday`}
                        </Text>
                      </Flex>
                    ))}
                </Stack>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
}
