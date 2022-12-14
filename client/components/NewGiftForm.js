import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Box,
  useToast,
} from '@chakra-ui/react';

import { useState } from 'react';
import {
  addGift,
  deleteGift,
  editGift,
  getAllGifts,
  getById,
} from '../services/gift-utils.js';
import styles from '../global.css';
import useFriends from '../hooks/useFriends.js';
import { addFriend } from '../services/friend-utils.js';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext.js';

export default function NewGiftForm({
  gift,
  setGift,
  setGifts,
  isEditing,
  setIsEditing,
}) {
  const { user } = useUser();
  const { friends } = useFriends(null, user);
  const [idea, setIdea] = useState(gift.idea || '');
  const [recipient, setRecipient] = useState(gift.friend?.name || '');
  const [link, setLink] = useState(gift.link || '');
  const [cost, setCost] = useState(gift.price || 0);
  const [occasion, setOccasion] = useState(gift.occasion || '');
  const [isIdeaError, setIsIdeaError] = useState(false);
  const [isRecipientError, setIsRecipientError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const price = !cost ? 0 : cost;
  let isFormInvalid = false;
  // let selectedFriend = gift.friend || {};

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(recipient.toLowerCase())
  );

  const handleAddGift = async (e) => {
    if (!idea) {
      setIsIdeaError(true);
      isFormInvalid = true;
    }

    if (!recipient) {
      setIsRecipientError(true);
      isFormInvalid = true;
    }
    if (isFormInvalid) return;

    // if (!selectedFriend.id && recipient) {
    //   const newFriend = await addFriend({ name: recipient });
    //   selectedFriend = newFriend;
    // }

    let found = friends.find((friend) => friend.name === recipient);
    found
      ? (found = found)
      : (found = await addFriend({ name: recipient }));

    const newGift = {
      idea,
      friendId: found.id, // selectedfriend.id
      link,
      price,
      occasion,
    };

    await addGift(newGift);
    const newList = await getAllGifts();
    setGifts(newList);
    setIdea('');
    setRecipient('');
    setLink('');
    setCost('');
    setOccasion('');
    // selectedFriend = {};
    setIsIdeaError(false);
    setIsRecipientError(false);
    isFormInvalid = false;
    toast({
      position: 'bottom',
      duration: 2000,
      render: () => (
        <Box
          borderRadius="5px"
          boxShadow="md"
          bg="purple.400"
          color="white"
          p="15px"
          fontWeight="bold"
          fontSize="15px"
          h="55px"
          mb={{ base: '35px', md: '150px' }}
        >
          {`Successfully added '${newGift.idea}' to your stash!`}
        </Box>
      ),
    });
  };

  const handleEditGift = async () => {
    if (!idea) {
      setIsIdeaError(true);
      isFormInvalid = true;
    }

    if (!recipient) {
      setIsRecipientError(true);
      isFormInvalid = true;
    }
    if (isFormInvalid) return;

    let found = friends.find((friend) => friend.name === recipient);
    found
      ? (found = found)
      : (found = await addFriend({ name: recipient }));

    const id = gift.id;
    const newValues = {
      id,
      idea,
      friendId: found.id,
      link,
      price,
      occasion,
    };
    await editGift({ ...gift, ...newValues });
    const updatedGift = await getById(id);
    setGift(updatedGift);
    setIsEditing(false);
  };

  const handleDeleteGift = async () => {
    await deleteGift(gift.id);
    navigate('/gifts');
  };

  return (
    <>
      <Box
        boxShadow="lg"
        p="6"
        rounded="lg"
        bg="#fff9ec"
        mt={{ base: '20px', md: '0px' }}
        w={{ base: '300px', md: '500px' }}
      >
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Stack spacing={1} w={{ base: '250px', md: '400px' }}>
            <h1 className={styles.title}>Stash It!</h1>
            <FormControl
              isRequired
              isInvalid={isIdeaError}
              autoComplete="new-off"
            >
              <FormLabel
                requiredIndicator
                htmlFor="idea"
                size="sm"
                fontWeight="bold"
              >
                Gift:
              </FormLabel>
              <Input
                autoComplete="off"
                type="text"
                id="idea"
                size="sm"
                borderRadius="5px"
                variant="outline"
                bg="white"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
              {isIdeaError ? (
                <FormErrorMessage>
                  You forgot to enter your genius gift idea!
                </FormErrorMessage>
              ) : (
                <FormHelperText visibility="hidden">
                  &nbsp;
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={isRecipientError}
              autoComplete="new-off"
            >
              <FormLabel
                requiredIndicator
                htmlFor="recipient"
                size="sm"
                fontWeight="bold"
              >
                Recipient:
              </FormLabel>
              <Input
                autoComplete="off"
                type="text"
                id="recipient"
                size="sm"
                borderRadius="5px"
                variant="outline"
                bg="white"
                value={recipient}
                onFocus={() => setIsFocused(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setIsFocused(false);
                  }, 500)
                }
                onChange={(e) => setRecipient(e.target.value)}
              />
              {isFocused && recipient !== '' && (
                <Box
                  bg="white"
                  position="absolute"
                  w={{ base: '250px', md: '400px' }}
                  zIndex="1"
                >
                  <Box
                    bg="white"
                    position="relative"
                    w={{ base: '250px', md: '400px' }}
                    boxShadow="2xl"
                    rounded="lg"
                  >
                    <Flex direction="column" alignItems="flex-start">
                      {filteredFriends.map((friend) => (
                        <Button
                          key={friend.id}
                          variant="unstyled"
                          pl="5px"
                          onClick={() => {
                            setRecipient(friend.name);
                            // selectedFriend = friend;
                            setIsFocused(false);
                          }}
                        >
                          {friend.name}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              )}
              {isRecipientError ? (
                <FormErrorMessage>
                  Who would love to receive this gift?
                </FormErrorMessage>
              ) : (
                <FormHelperText visibility="hidden">
                  &nbsp;
                </FormHelperText>
              )}
            </FormControl>
            <FormControl autoComplete="new-off">
              <FormLabel htmlFor="link" size="sm" fontWeight="bold">
                Link:
              </FormLabel>
              <Input
                autoComplete="off"
                type="text"
                id="link"
                size="sm"
                borderRadius="5px"
                variant="outline"
                bg="white"
                placeholder="http://small-local-vendor.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />

              <FormHelperText visibility="hidden">
                &nbsp;
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="cost" size="sm" fontWeight="bold">
                Price:
              </FormLabel>
              <Input
                type="number"
                id="cost"
                size="sm"
                borderRadius="5px"
                variant="outline"
                bg="white"
                value={price}
                onChange={(e) => setCost(e.target.value)}
              />

              <FormHelperText visibility="hidden">
                &nbsp;
              </FormHelperText>
            </FormControl>
            <FormControl autoComplete="new-off">
              <FormLabel
                htmlFor="occasion"
                size="sm"
                fontWeight="bold"
              >
                Occasion:
              </FormLabel>
              <Input
                autoComplete="off"
                type="text"
                id="occasion"
                size="sm"
                borderRadius="5px"
                variant="outline"
                bg="white"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
              <FormHelperText visibility="hidden">
                &nbsp;
              </FormHelperText>
            </FormControl>
            <Flex justifyContent="center" gap="15px">
              <Button
                onClick={isEditing ? handleEditGift : handleAddGift}
                size="md"
                w="75px"
                colorScheme="purple"
              >
                Save
              </Button>
              {isEditing && (
                <Button
                  onClick={handleDeleteGift}
                  size="md"
                  w="75px"
                  colorScheme="pink"
                >
                  Delete
                </Button>
              )}
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
