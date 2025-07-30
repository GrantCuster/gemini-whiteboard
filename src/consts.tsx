export const idealResolution = {
  width: 3840,
  height: 2160,
};

export const startingPrompt = `Analyze the image above and respond with text based on the action described in the pink post-it note.

Some examples of actions:
"define" - define the word above the post-it note.
"info" - give information about person, place, or thing above the post-it note.
"critique" - critique the item the post-it note is pointing to.
"compare" - this action uses two post-it notes, each labelled with "compare". Compare the two items the post-it notes are pointing to.
"connect" - this action uses two post-it notes, each labelled with "connect". Connect the two items the post-it notes are pointing to.
"origin" - give the origin of the item the post-it note is pointing to.

Pay special attention to where the arrow on the post-it note is pointing. Keep your response concise and relevant to the action described in the post-it note. Do not include any other text or markdown formatting.`
