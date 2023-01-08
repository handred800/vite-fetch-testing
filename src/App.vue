<template>
  <router-view></router-view>
</template>
<style>
@font-face {
	font-family: 'HunInn';
	src: url(https://cdn.jsdelivr.net/gh/marsnow/open-huninn-font@1.1/font/jf-openhuninn.woff) format("woff"), /* Modern Browsers */
	url(https://cdn.jsdelivr.net/gh/marsnow/open-huninn-font@1.1/font/jf-openhuninn.ttf) format("truetype"); /* Safari, Android, iOS */
}

html,
body {
  font-family: 'HunInn', serif;
  margin: 0;
  padding: 5px;
}

a {
  text-decoration: none;
  color: initial;
}
h1,
h2,
h3,
h4,
h5,
p {
  margin: 0;
}
</style>