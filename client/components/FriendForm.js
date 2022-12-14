import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import styles from '../global.css';
import {
  addFriend,
  editFriend,
  getFriendById,
} from '../services/friend-utils.js';

export default function FriendForm({
  friend,
  setFriend,
  calendarDate,
  isEditing,
  setIsEditing,
}) {
  const [name, setName] = useState(friend?.name || '');
  const [birthdayInput, setBirthdayInput] = useState(
    calendarDate || ''
  );
  const [address, setAddress] = useState(friend?.address || '');
  const [isNameError, setIsNameError] = useState(false);
  const toast = useToast();

  const birthday = !birthdayInput ? null : birthdayInput;
  let isFormInvalid = false;

  const handleAddFriend = async (e) => {
    if (!name) {
      setIsNameError(true);
      isFormInvalid = true;
    }
    if (isFormInvalid) return;

    const newFriend = {
      name,
      birthday,
      address,
    };

    await addFriend(newFriend);
    setName('');
    setBirthdayInput('');
    setAddress('');
    setIsNameError(false);
    isFormInvalid = false;
    toast({
      position: 'bottom',
      duration: 2000,
      render: () => (
        <Box
          borderRadius="5px"
          boxShadow="md"
          bg="pink.400"
          color="white"
          p="15px"
          fontWeight="bold"
          fontSize="15px"
          h="55px"
          mb={{ base: '35px', md: '150px' }}
        >
          {`Successfully added ${newFriend.name}!`}
        </Box>
      ),
    });
  };

  const handleEditFriend = async () => {
    if (!name) {
      setIsNameError(true);
      isFormInvalid = true;
    }
    if (isFormInvalid) return;

    const newValues = {
      id: friend.id,
      name,
      birthday,
      address,
    };
    await editFriend({ ...friend, ...newValues });
    const editedFriend = await getFriendById(friend.id);
    setFriend(editedFriend);
    setIsEditing(false);
  };
  return (
    <Box
      className={styles.screenOnly}
      boxShadow="lg"
      p="6"
      rounded="lg"
      bg="#fff9ec"
      w={{ base: '300px', md: '400px' }}
      h="500px"
      mt={{ base: '25px', md: '185px' }}
      mb={{ base: '75px', md: '0px' }}
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={1}>
          <h1 className={styles.friend}>
            {isEditing ? 'Edit Friend' : 'Add a Friend!'}
          </h1>
          <FormControl
            isRequired
            isInvalid={isNameError}
            autoComplete="new-off"
          >
            <FormLabel
              requiredIndicator
              htmlFor="name"
              size="sm"
              fontWeight="bold"
              mt="25px"
            >
              Name:
            </FormLabel>
            <Input
              autoComplete="off"
              type="text"
              id="name"
              size="sm"
              borderRadius="5px"
              variant="outline"
              bg="white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {isNameError ? (
              <FormErrorMessage>
                What is your friend's name?
              </FormErrorMessage>
            ) : (
              <FormHelperText visibility="hidden">
                &nbsp;
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="birthday" size="sm" fontWeight="bold">
              Birthday:
            </FormLabel>
            <Input
              type="date"
              id="birthday"
              size="sm"
              borderRadius="5px"
              variant="outline"
              bg="white"
              value={birthdayInput}
              onChange={(e) => setBirthdayInput(e.target.value)}
            />
            <FormHelperText visibility="hidden">
              &nbsp;
            </FormHelperText>
          </FormControl>
          <FormControl autoComplete="new-off">
            <FormLabel htmlFor="address" size="sm" fontWeight="bold">
              Address:
            </FormLabel>
            <Textarea
              autoComplete="off"
              type="text"
              id="address"
              size="sm"
              h="40px"
              borderRadius="5px"
              variant="outline"
              bg="white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <FormHelperText visibility="hidden">
              &nbsp;
            </FormHelperText>
          </FormControl>
          <Flex justifyContent="center">
            <Button
              onClick={isEditing ? handleEditFriend : handleAddFriend}
              size="md"
              w="75px"
              colorScheme="pink"
            >
              Save
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
}
