import { Route, Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import HomePage from './pages/home';
import ClassLibraryPage from './pages/class-library';
import NotFound from './pages/not-found';
import ResourcesPage from './pages/resources';
import TodayPage from './pages/today';

const App: Component = () => {
    return (
        <Router>
            <Route path="/" component={HomePage} />
            <Route path="/class-library" component={ClassLibraryPage} />
            <Route path="/today" component={TodayPage} />
            <Route path="/resources" component={ResourcesPage} />

            <Route path="*" component={NotFound} />
        </Router>
    );
};

export default App;
