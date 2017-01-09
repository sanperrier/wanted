/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import './style.scss';
import 'npm-font-open-sans/open-sans.css';
import 'ionicons/dist/css/ionicons.css';
import 'utils/Date.toISOStringTZ';

import { Application } from 'base';

import AppRouter from './AppRouter.js';
import AppController from './AppController';

let WantedApplication = Application.extend({
    initialize() {
        window.app = this;
    },

    onStart() {
        this.router = new AppRouter({ controller: new AppController() });
        Backbone.history.start();
    }
});

let app = new WantedApplication();

_.defer(() => app.start());

export default app;