[![Build Status](https://travis-ci.org/NightingaleStudio/exam.js.svg?branch=master)](https://travis-ci.org/NightingaleStudio/exam.js)
[![Code Climate](https://codeclimate.com/github/NightingaleStudio/exam.js/badges/gpa.svg)](https://codeclimate.com/github/NightingaleStudio/exam.js)
[![Test Coverage](https://codeclimate.com/github/NightingaleStudio/exam.js/badges/coverage.svg)](https://codeclimate.com/github/NightingaleStudio/exam.js/coverage)
[![npm version](https://badge.fury.io/js/exam.js.svg)](http://badge.fury.io/js/exam.js)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/NightingaleStudio/exam.js.svg)](http://isitmaintained.com/project/NightingaleStudio/exam.js "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/NightingaleStudio/exam.js.svg)](http://isitmaintained.com/project/NightingaleStudio/exam.js "Percentage of issues still open")

###Exam.js - библиотека для написания интерактивных вопросов (тестов)

При помощи данной библиотеки вы можете создавать интерактивные вопросы (тесты), используя простой человекочитаемый язык разметки. Данный язык поддерживает [Markdown](https://ru.wikipedia.org/wiki/Markdown) и [MathJax (asciimath)](http://asciimath.org/). Помимо текстовых вопросов поддерживаются видео, аудио- и вопросы с рисунками.


[Демо](http://nightingale-studio.com/exam.js/)

###Установка

```bash
npm install exam.js
```
###Как это работает

Для начала работы нужно подключить скрипт **exam.js** или **exam.min.js**, а так же стиль **exam.css**.

```javascript
var examjs = parser.parse(source);
examjs.html // результирующий HTML, нужно поместить в любой тэг DOM'a
...

examjs.initQuestions(); //инициализация вопросов
```
