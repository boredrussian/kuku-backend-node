import stringify from "fast-json-stable-stringify";
import sortKeys from "sort-keys";
import * as bitcoinMessage from "bitcoinjs-message";

const getPostJsonFromObj = (post: any) => {
  let postCopy = JSON.parse(JSON.stringify(post));
  if (postCopy.hash || postCopy.signatures) {
    delete postCopy.hash;
    delete postCopy.signatures;
  }
  postCopy = sortKeys(postCopy);
  return stringify(postCopy);
};

export const isPostValid = (post: any) => {
  const { address } = post.source;
  const { signatures } = post;
  const message = getPostJsonFromObj(post);
  let isValid;
  try {
    isValid = bitcoinMessage.verify(message, address, signatures);
  } catch (e) {
    console.log("[isPostValid]", e);
    isValid = false;
  }

  return isValid;
};
