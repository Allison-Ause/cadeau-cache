import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { deleteGift, getAllGifts } from '../services/gift-utils.js';
import { Link as RLink } from 'react-router-dom';

export default function Gift({ gift, setGifts }) {
  // make this flex box with column of individual gift rows
  const handleDelete = async () => {
    await deleteGift(gift.id);
    const giftList = await getAllGifts();
    setGifts(giftList);
  };

  return (
    <Flex
      direction="row"
      gap="3.7px"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <Link as={RLink} to={`gifts/${gift.id}`} fontWeight="bold">
        {gift.idea}
      </Link>
      <Text>{`for `} </Text>
      <Link as={RLink} to={`friends/${gift.friend.id}`}>
        {gift.friend.name}
      </Link>
      <IconButton
        aria-label="delete gift"
        icon={<DeleteIcon />}
        variant="ghost"
        colorScheme="purple"
        onClick={handleDelete}
      />
    </Flex>
  );
}
