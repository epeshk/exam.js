[![Build Status](https://travis-ci.org/NightingaleStudio/exam.js.svg?branch=master)](https://travis-ci.org/NightingaleStudio/exam.js)

###Exam.js - библиотека для написания интерактивных вопросов (тестов)

При помощи данной библиотеки вы можете создавать интерактивные вопросы (тесты), используя простой человекочитаемый язык разметки. Данный язык поддерживает [Markdown](https://ru.wikipedia.org/wiki/Markdown) и [MathJax (asciimath)](http://asciimath.org/). Помимо текстовых вопросов поддерживаются видео, аудио- и вопросы с рисунками.


###Установка




Вот простой пример:

	ТЕСТЫ

	ТЕКСТ

	В каком году родился А.С. Пушкин?
	-1800
	-1801
	+1799
	-1789

	КОНЕЦ ТЕСТОВ

В данном примере ключевыми словами "ТЕСТЫ" и "КОНЕЦ ТЕСТОВ" отмечаются границы блока с тесами, а ключевым словом "ТЕКСТ" - начало блока простых текстовых тестов. После ключевого слова "ТЕКСТ" может идти неограниченное число текстовых тестов.

Данный пример будет преобразован в это:

![simple text test](http://dl2.joxi.net/drive/0001/2547/129523/150607/8e3abf44db.png)

Текстовые вопросы могут быть трех типов:

- вопрос с одним единственным вариантом ответа:

---

	ТЕСТЫ

	ТЕКСТ

	В каком году родился А.С. Пушкин?
	+1799

	КОНЕЦ ТЕСТОВ
	
---

- вопрос с несколькими вариантами ответа, но одним верным (см. пример в выше);
- вопрос с несколькими вариантами ответа и несколькими правильными ответами:

---

	ТЕСТЫ

	ТЕКСТ

	Что из нижеперечисленного является цветом?
	+красный
	-дерево
	+зеленый
	-JavaScript

	КОНЕЦ ТЕСТОВ
	
---


###Поддержка MathJax

Данная библиотека полностью поддерживает MathJax в формате нотации AsciiMath. Все математические формулы должны быть записаны внутри двойных фигурных скобок {{ }}:

	Укажите сходящийся ряд:
	-{{sum_(n - 1)^oo 1/n}}
	-{{sum_(n - 1)^oo 1/(n + 3)}}
	+{{sum_(n - 1)^oo 1/n^2}}
	-{{sum_(n - 1)^oo 1 + sin(n)/n}}

Это будет преобразовано в следующий вопрос:

![MathJax example](http://dl1.joxi.net/drive/0001/2547/129523/150607/b24fb26017.png)


###Медиа-вопросы

Exam.js позволяет создавать не только текстовые, но и аудио-, видео-вопросы и вопросы с рисунками:

	ТЕСТЫ

	РИСУНОК

	На каком рисунке изображен график функции {{y = sin(x)}}?
	-http://dl2.joxi.net/drive/0001/2547/129523/150527/27d5954b08.jpg
	+http://dl1.joxi.net/drive/0001/2547/129523/150527/af2ed6be13.jpg
	
	КОНЕЦ ТЕСТОВ
	
	
Данный вопрос будет преобразован в это:

![image question](http://dl2.joxi.net/drive/0001/2547/129523/150607/2d3f6b0ec5.png)

То есть, чтобы создать медиа-вопрос нам нужно сначала открыть блок вопросов конкретного типа (ВИДЕО, АУДИО, РИСУНОК), а затем описать вопрос, где ответами являются ссылки на медиа-контент.