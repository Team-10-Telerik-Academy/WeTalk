import React, { useState, useRef } from 'react';
import EmojiPicker, { EmojiStyle, EmojiClickData } from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceLaugh } from '@fortawesome/free-regular-svg-icons';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';

type EmojiMap = { [key: string]: string };

interface EmojiInputProps {
  onSubmit: (message: string) => void;
}

const replaceStringWithEmoji = (str: string) => {
  const emojiMap: EmojiMap = {
    ':)': '😊',
    ':(': '🙁',
    ':D': '😁',
    ';(': '😥',
    ':O': '😮',
    ';)': '😉',
    '8)': '😎',
    '>:@': '😡',
    ':heart_eyes': '😍',
    ':sob': '😭',
    ':joy': '😂',
    ':thumbsup': '👍',
    ':thumbsdown': '👎',
    ':clap': '👏',
    ':fire': '🔥',
    ':rocket': '🚀',
    ':tada': '🎉',
    ':pray': '🙏',
    ':muscle': '💪',
    ':100': '💯',
    ':sparkles': '✨',
    ':sunglasses': '😎',
    ':angry': '😡',
    ':heart': '❤️',
    ':star': '⭐',
    ':exclamation': '❗',
    ':question': '❓',
    ':thumbs_up': '👍',
    ':thumbs_down': '👎',
    ':ok_hand': '👌',
    ':point_up': '☝️',
    ':point_down': '👇',
    ':point_left': '👈',
    ':point_right': '👉',
    ':raised_hands': '🙌',
    ':handshake': '🤝',
    ':v': '✌️',
    ':wave': '👋',
    ':broken_heart': '💔',
    ':open_mouth': '😮',
    ':cry': '😢',
    ':laughing': '😆',
    ':smiley': '😃',
    ':sweat_smile': '😅',
    ':blush': '😊',
    ':wink': '😉',
    ':yum': '😋',
    ':relieved': '😌',
    ':neutral_face': '😐',
    ':confused': '😕',
    ':pouting': '😡',
    ':ghost': '👻',
    ':skull': '💀',
    ':alien': '👽',
    ':robot': '🤖',
    ':poop': '💩',
  };

  const regex =
    /(:\)|:\(|:D|;\(|:O|;\)|8\)|>:@|:heart_eyes|:sob|:joy|:thumbsup|:thumbsdown|:clap|:fire|:rocket|:tada|:pray|:muscle|:100|:sparkles|:sunglasses|:angry|:heart|:star|:exclamation|:question|:thumbs_up|:thumbs_down|:ok_hand|:muscle|:point_up|:point_down|:point_left|:point_right|:raised_hands|:clap|:pray|:handshake|:v|:wave|:thumbsup|:thumbsdown|:heart|:broken_heart|:open_mouth|:cry|:laughing|:smiley|:sweat_smile|:blush|:wink|:yum|:relieved|:heart_eyes|:sunglasses|:neutral_face|:confused|:angry|:pouting|:ghost|:skull|:alien|:robot|:poop)/g;

  return str.replace(regex, (match: string) => emojiMap[match] || match);
};

const EmojiInput: React.FC<EmojiInputProps> = ({ onSubmit, handleChange }) => {
  const [message, setMessage] = useState('');
  const [transformedMessage, setTransformedMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('1f60a');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filteredEmojiList, setFilteredEmojiList] = useState<string[]>([]);

  const [emojiMap, setEmojiMap] = useState<EmojiMap>({
    ':)': '😊',
    ':(': '🙁',
    ':D': '😁',
    ';(': '😥',
    ':O': '😮',
    ';)': '😉',
    '8)': '😎',
    '>:@': '😡',
    ':heart_eyes': '😍',
    ':sob': '😭',
    ':joy': '😂',
    ':thumbsup': '👍',
    ':thumbsdown': '👎',
    ':clap': '👏',
    ':fire': '🔥',
    ':rocket': '🚀',
    ':tada': '🎉',
    ':pray': '🙏',
    ':muscle': '💪',
    ':100': '💯',
    ':sparkles': '✨',
    ':sunglasses': '😎',
    ':angry': '😡',
    ':heart': '❤️',
    ':star': '⭐',
    ':exclamation': '❗',
    ':question': '❓',
    ':thumbs_up': '👍',
    ':thumbs_down': '👎',
    ':ok_hand': '👌',
    ':point_up': '☝️',
    ':point_down': '👇',
    ':point_left': '👈',
    ':point_right': '👉',
    ':raised_hands': '🙌',
    ':handshake': '🤝',
    ':v': '✌️',
    ':wave': '👋',
    ':broken_heart': '💔',
    ':open_mouth': '😮',
    ':cry': '😢',
    ':laughing': '😆',
    ':smiley': '😃',
    ':sweat_smile': '😅',
    ':blush': '😊',
    ':wink': '😉',
    ':yum': '😋',
    ':relieved': '😌',
    ':neutral_face': '😐',
    ':confused': '😕',
    ':pouting': '😡',
    ':ghost': '👻',
    ':skull': '💀',
    ':alien': '👽',
    ':robot': '🤖',
    ':poop': '💩',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = event.target.value;
    setMessage(newMessage);

    // Filter emoji choices based on the input substring
    const filteredEmojis = Object.keys(emojiMap).filter((emoji) =>
      emoji.includes(newMessage)
    );
    setFilteredEmojiList(filteredEmojis);

    // Show/hide the emoji picker based on input
    setShowEmojiPicker(newMessage.length > 0);

    // Update the transformed message with emojis
    const messageWithEmoji = replaceStringWithEmoji(newMessage);
    setTransformedMessage(messageWithEmoji);

    // Call the provided handleChange callback
    handleChange(event);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setMessage((message) => message + emoji);
    setTransformedMessage(replaceStringWithEmoji(message + emoji));
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  function handleOnEnter(newText: string) {
    const messageWithEmoji = replaceStringWithEmoji(newText);
    onSubmit(messageWithEmoji);
    setMessage('');
    setTransformedMessage('');
  }

  const onClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage(
      (message) =>
        message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
    setSelectedEmoji(emojiData.unified);
    inputRef.current?.focus(); // Focus back on the input after selecting an emoji

    // Update the transformed message with emojis
    const messageWithEmoji = replaceStringWithEmoji(
      message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
    setTransformedMessage(messageWithEmoji);
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.length > 0) {
      const messageWithEmoji = replaceStringWithEmoji(message);
      onSubmit(messageWithEmoji);
      setMessage('');
      setTransformedMessage('');
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center w-full">
      <div className="dropdown dropdown-top dropdown-end">
        <div tabIndex={0} className="cursor-pointer">
          <span className="mr-2 text-primary">
            <FontAwesomeIcon icon={faFaceLaugh} size="2xl" />
          </span>
        </div>
        <ul className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box">
          <EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.APPLE}
          />
        </ul>
      </div>
      <form className="flex justify-center" onSubmit={handleSendMessage}>
        <div>
          <input
            type="text"
            placeholder="Send Message"
            className="text-input border rounded-xl text-start p-2 w-96 h-14 my-4"
            value={transformedMessage} // Display the transformed message
            onChange={handleInputChange}
            ref={inputRef}
            onEnter={handleOnEnter}
          />
        </div>
        <button
          type="submit"
          className="ml-2 p-4 bg-blue-500 text-secondary rounded-xl my-4 hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faPaperPlane} size="xl" />
        </button>
      </form>
    </div>
  );
};

export default EmojiInput;
