<div align="center">
  <br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TaskFlow-0b1120?style=for-the-badge&logo=task&logoColor=white&labelColor=818cf8" />
    <img src="https://img.shields.io/badge/TaskFlow-ffffff?style=for-the-badge&logo=task&logoColor=white&labelColor=4f46e5" alt="TaskFlow" width="200"/>
  </picture>
  <br/>
  <h3 align="center">Kanban-система управления задачами</h3>
  <p align="center">
    Современная доска для организации проектов, отслеживания прогресса и командной работы
  </p>
  <br/>

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
  [![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
  [![Pydantic](https://img.shields.io/badge/Pydantic-2.5-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
  [![Pytest](https://img.shields.io/badge/Pytest-8.3-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)

  <br/>
</div>

## ✨ Возможности

- **Drag-and-drop доска** — перетаскивайте задачи между колонками (To Do → In Progress → Review → Done)
- **Управление задачами** — создание, редактирование, удаление, назначение исполнителей, приоритеты и теги
- **Комментарии** — обсуждайте задачи внутри карточки
- **История изменений** — полный аудит всех действий над задачей
- **Дашборд** — статистика по проекту, прогресс выполнения, нагрузка команды, лента активности
- **Поиск и фильтрация** — быстрый поиск по названию, фильтр по статусу и приоритету
- **Ролевая модель** — три роли: Admin, Member, Viewer с разграничением прав
- **Цветовые темы** — Light и Dark с переключением в один клик
- **Адаптивный дизайн** — корректно работает на десктопе, планшете и мобильных устройствах

## 🛠️ Стек технологий

### Frontend
| Технология | Назначение |
|---|---|
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация |
| **Vite** | Сборщик |
| **Tailwind CSS** | Стилизация |
| **@dnd-kit** | Drag-and-drop |

### Backend (в разработке)
| Технология | Назначение |
|---|---|
| **Python 3.11+** | Язык |
| **FastAPI** | REST API |
| **SQLite** | База данных |
| **SQLAlchemy** | ORM |
| **Pydantic** | Валидация |
| **Pytest** | Тестирование |

## 🚀 Запуск проекта

```bash
# клонировать репозиторий
git clone <repo-url>
cd taskflow

# установить зависимости
cd frontend
npm install

# запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

## 🔑 Демо-доступ

На странице входа доступны предустановленные пользователи:

| Роль | Email |
|---|---|
| **Admin** | alex@taskflow.dev |
| **Member** | sarah@taskflow.dev |
| **Member** | marcus@taskflow.dev |
| **Viewer** | emily@taskflow.dev |

Пароль не требуется — любой ввод проходит авторизацию.

## 📁 Структура проекта

```
frontend/
├── src/
│   ├── components/        # UI-компоненты
│   │   ├── auth/          # Авторизация
│   │   ├── board/         # Доска и карточки
│   │   ├── common/        # Переиспользуемые (Button, Modal, Input...)
│   │   ├── layout/        # Header, Sidebar, Layout
│   │   ├── task/          # Модалки задач
│   │   └── users/         # Управление пользователями
│   ├── contexts/          # React Context (Auth, Board, Theme)
│   ├── pages/             # Страницы (Board, Tasks, Dashboard, Users)
│   ├── services/          # Логика localStorage
│   ├── styles/            # Глобальные стили и темы
│   └── types/             # TypeScript-типы
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 📄 Лицензия

MIT
