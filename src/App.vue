<template>
  <router-view></router-view>
</template>
<style>
@font-face {
	font-family: 'HunInn';
	src: url(https://cdn.jsdelivr.net/gh/marsnow/open-huninn-font@1.1/font/jf-openhuninn.woff) format("woff"), /* Modern Browsers */
	url(https://cdn.jsdelivr.net/gh/marsnow/open-huninn-font@1.1/font/jf-openhuninn.ttf) format("truetype"); /* Safari, Android, iOS */
}
:root {
  --primary: #117e96; 
  --secondary: #b3f7ef;
}

html,
body {
  font-family: 'HunInn', serif;
  margin: 0;
  padding: 5px;
}

a {
  text-decoration: none;
  color: var(--primary);
}
a:hover,a:focus {
  text-decoration: underline;
}

h1,
h2,
h3,
h4,
h5,
p {
  margin: 0;
}

ul, ol {
  list-style: none;
  padding: 0;
}

textarea {
  display: block;
  width: 100%;
  resize: vertical;
  /* white-space: pre-line; */
}

.template {
  display: block;
  width: 100%;
  max-width: 1024px;
  max-height: 500px;
  overflow-y: auto;
}

.template li {
  display: flex;
  justify-content: space-between;
}


.card {
  display: block;
  padding: 15px 20px;
  margin-bottom: 15px;
  background: #fff;
  color: #000;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  transition: 0.15s;
}
.card.is-active {
  outline: 3px solid var(--primary);
}
.card[href]:hover {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  text-decoration: none;
}

.card img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background-color: silver;
}

pre {
  white-space: pre-line;
}
</style>