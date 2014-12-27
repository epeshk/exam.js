##Описание

Язык разметки методических материалов и тестовых заданий Exam.js является расширением языка разметки текстов Markdown и использует в своей основе библиотеку [markdown.js](https://github.com/evilstreak/markdown-js) для трансляции markdown в html и библиотеку [jison.js](https://github.com/zaach/jison) для реализации парсера языка Exam.js.

##Разработчикам
Дополнительную информацию о разработке можно получить [здесь](https://github.com/NightingaleStudio/exam.js/wiki).

##Черновик cпецификации языка Exam.js

Синтаксические конструкции языка Exam.js:

#####Именованная секция
```javascript
{-- Section name
	
--}

```
Секции содержат код разметки и контент. После знаков ```{--``` следует имя секции, а так же модификаторы секции. Для каждой секции генерируется уникальный идентификатор, далее ID, использующийся в качестве якоря для секции вопросов или одиночных вопросов (см. далее)


#####Именованная секция с модификаторами

```javascript
{-- Section name (modifier: value; modifier: value; ... modifier: value;)

--}
```

Модификаторами являются зарезервированные ключевые слова, выступающие в роли флагов для включения специальных режимов преобразования кода блоков. Модификатору задаются определенные параметры. Существуют булавы модификаторы, которые не принимают никаких параметров:

```javascript
{-- Section name (modifier; modifier; ... modifier;)

--}
```

При этом модификаторы и параметрами и булавы модификаторы можно использовать совместно:

```javascript
{-- Section name (modifier: value; modifier; modifier: value;)

--}
```

Модификаторы:

-	questions (принимает значения: **inline**, **group**);
-	questionsCount: (принимает **целое число** в виде параметра, число отвечает за количество вопросов выдаваемых в списке вопросов, если был установлен модификатор **questions: group*;
-	successLimit: (принимает в качестве параметров **целое число**, отражающее абсолютное значение правильных ответов, либо же значение в процентах. При достижении заданного предела, секция считается освоенной и разрешается приступить к изучению следующей за ней секции. В случае отсутствия данного модификатора, следующая секция будет доступна по умолчанию);
-	***список будет пополняться***

####Именованная секция вопросов

```javascript
{?- Section name
	
--}
```

Именованная секция вопросов предназначена для объединения блока вопросов одной общей темой. Тематическим блоком является контент (не блоки вопросов и не секции с блоками вопросов), содержащийся в родительской секции выше секции вопросов. Например:

```javascript
{-- Первый закон Ньютона

	Формулировка первого закона Ньютона: "Существуют такие системы отсчёта, называемые 
	инерциальными, относительно которых материальные точки, когда на них не действуют
	никакие силы (или действуют силы взаимно уравновешенные), находятся в состоянии
	покоя или равномерного прямолинейного движения."
	
	{?- Вопросы о первом законе Ньютона
		
	--}
--}
```

В данном примере при неправильно ответе на вопрос ссылка на теоретический материал будет ссылаться на формулировку закона выше секции вопросов. Если после данной секции вопросов будет другой текст, после которого в свою очередь будет находится другая секция вопросов, то при неправильном ответе на вопросы из второй секции, ссылки будут вести на материал из второго текстового блока.


####Именованные секции вопросов с модификаторами

Поведение секций вопросов, так же как и обычных секций может быть изменено при помощи модификаторов. Установить модификатор с определенным значением можно аналогичным способом:

```javascript
{?-- Section name (modifier: value; modifier: value; ... modifier:value;)
	
--}
``` 

Список модификаторов секции вопросов:

- showHelpLinks (является нулевым модификатором. Если он установлен, то в случае неверного ответа на вопрос появляется ссылка на теоретический материал, связанный с этим вопросом (см. выше). Если не установлен данный модификатор, то ссылки показываться не будут);
- instantLinks (является нулевым модификатором. Если он установлен, то ссылки на теоретический материал появляются сразу же при неправильном ответе. Если данный модификатор не установлен, то ссылки будут появляться только в случае ответов на все вопросы из секции вопросов);
- retries (принимает **целое число** в качестве параметра. Данный параметр означает количество попыток дать правильный ответ, перед тем как появится ссылка на теоретический материал. Если данный модификатор не установлен, то количество попыток равно 1. Так же при установленном модификаторе retryAfter (см. ниже), только после данного количества попыток дать правильный ответ произойдет блокировка вопроса/вопросов);
- retryAfter: (принимает  **целое число** в качестве параметра. Данный параметр отражает число минут, в течении которых нельзя будет снова отвечать на вопрос/вопросы. Если данный модификатор не установлен, то отвечать можно сразу)

####Последовательные и вложенный секции

Обычные (не вопросные) секции могут располагаться последовательно и в тоже время быть вложенными одна в другую. Это позволяет создавать методические материалы любой сложности:

```javascript
{-- Родительская секция 1
	{-- Вложенная "дочерняя" секция
	
	--}
--}
{-- Родительская секция 2
	{-- Другая вложенная секция
	
	--}
--}
```

Каждая отдельная "родительская" секция на выходе представляет из себя отдельную страницу методического материала и, в случае наличия соответствующего модификатора, не пропускает на следующую страницу, до получения необходимого количества правильных ответов.

"Дочерние" секции являются отдельными логическими блоками методического материала и все доступны на одной странице, за исключением случая, если в предшествующей "дочерней" секции одно и того же уровня есть модификатор, ограничивающий доступ к следующей секции того же уровня вложенности.

#### Вопросные блоки

Вопросный блок представляет из себя описание типа поля ввода, вариантов ответа, правильный ответ и (опционально) подсказку. Текст вопроса содержится вне контекста вопросного блока и является обычным текстом:

```javascript
В каком году родился Александр Сергеевич Пушкин? {{ ... :: 1799 }}
```

Данный блок будет преобразован в текстовое поле, в которое можно ввести произвольное значение.

На данный момент спецификацией учитываются 3 типа вопросных блоков: блок с произвольным вводом ответа, блок со списком ответов с одним правильным ответом, блок со списком ответов с несколькими правильными ответами.

Блок с произвольным вводом имеет следующую синтаксическую форму:

```javascript
{{текст вопроса :? ... :: правильный ответ }}
```

Блок со списком ответов с одним правильным ответом:

```javascript
{{текст вопроса :? 1 вариант, 2 вариант, N вариант :: 2 вариант }}
```

Блок со списком ответов с несколькими правильными ответами:

```javascript
{{текст вопроса :? 1 вариант, 2 вариант, N вариант :: 2 вариант, N вариант }}
```

Синтаксические элементы вопросного блока:

- {{ - начало блока
- }} - конец блока
- ... - произвольный ввод (в блоке, где установлен синтаксический элемент произвольного ввода варианта ответа не допускается перечисление вариантов ответа)
- , - разделитель вариантов ответа, в блоке с несколькими правильными ответами так же является разделителем правильных ответов
- :? - разделитель вопроса и вариантов ответа
- :: - разделитель вариантов ответов и правильного(-ых) ответа(-ов)
- :! - разделитель правильного(-ых) ответа(-ов) и текста подсказки

Пример блока с текстом подсказки:

```javascript
{{текст вопроса :? ... :: answer :! help text }}
```

В данном блоке при неправильном ответе будет выведен "help text". Это необязательно поле вопросных блоков.

