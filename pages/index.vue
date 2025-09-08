<template>
  <v-row class="mb-2">
    <v-col class="pb-0">
      <search-calendar
          @search="searchData($event)"
      />
    </v-col>
  </v-row>
  <div>
    <v-dialog v-model="dialog" width="470px">
      <v-card>
        <v-card-text>
          <span v-if="isAdmin" class="text-h5 d-flex justify-center mt-2 mb-8">Настройки графика</span>
          <custom-form
              :model="model"
              :fields="fields"
              @update:model="model = $event"
              v-model="valid"
              v-if="isAdmin"
          >
            <template v-slot:cancelLesson v-if="!!model?.id">
              <v-btn color="error" variant="tonal" class="mr-2 mb-2" block @click="remove()">отменить занятие</v-btn>
            </template>
            <template v-slot:action>
              <div class="d-flex justify-center">
                <v-btn color="error" variant="tonal" class="mr-2" @click="dialog = false">отменить</v-btn>
                <v-btn :disabled="!valid" color="primary" variant="tonal" @click="save()">сохранить</v-btn>
              </div>
            </template>
          </custom-form>
          <v-card-text v-else>
            <div class="sx__range-heading">{{`Студент: ${model.student.name}`}}</div>
            <div class="sx__range-heading">{{`Время: ${extractDate(model.start)} ${extractTime(model.start)}-${extractTime(model.end)}`}}</div>
            <div class="sx__range-heading">{{`Инструмент: ${model.instrument.name}`}}</div>
            <div class="sx__range-heading">{{`Кабинет: ${model.cabinet.name}`}}</div>
            <div class="sx__range-heading">{{`Тип занятия: ${model.session.name}`}}</div>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div id="calendar"></div>
  </div>
</template>

<script>
import {createCurrentTimePlugin} from '@schedule-x/current-time'
import {ScheduleXCalendar} from '@schedule-x/vue';
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createCalendarControlsPlugin} from '@schedule-x/calendar-controls'
import rules from '~/components/form/rules.js'


import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import CustomForm from "~/components/form/CustomForm.vue";
import http from "~/plugins/http";

export default {
  name: 'CalendarComponent',
  components: {CustomForm, ScheduleXCalendar},
  data: () => ({
    id: 10,
    rules: rules,
    dialog: false,
    valid: false,
    isAdmin: false,
    model: {},
    lessonTypes: [],
    cabinets: [],
    students: [],
    workers: [],
    events: [],
    range: null,
    eventsService: null,
    calendarControls: null,
    messages: [],
    config: [createCurrentTimePlugin({fullWeekWidth: true})],
    calendar: {

      locale: "ru-RU",
      dayBoundaries: {
        start: '07:00',
        end: '22:00',
      },
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events: [],
      weekOptions: {
        gridHeight: 1000,
        eventWidth: 95,
        timeAxisFormatOptions: {hour: '2-digit', minute: '2-digit'},
      },
      callbacks: {},
      calendars: {
        leisure: {
          colorName: 'leisure',
          lightColors: {
            main: '#1c7df9',
            container: '#1c7df9',
            onContainer: 'black',
          },
        },
      },
    }
  }),
  methods: {
    extractTime(dateTimeStr) {
      const match = dateTimeStr.match(/\d{2}:\d{2}/);
      return match ? match[0] : '';
    },
    extractDate(dateTimeStr) {
      const isoString = dateTimeStr.replace(" ", "T");
      const dateObj = new Date(isoString);
      return dateObj.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    },
    searchData(search) {
      let query = `start>=${this.formatQuery(this.range.start)};end<=${this.formatQuery(this.range.end)}`;
      if (search && search.trim() !== '') {
        // Допустим, мы фильтруем по имени преподавателя (worker.name), как в примере:
        query += `;${search}*`;
      }
      http.api.lesson.search(query)
          .then(r => {
            this.events = r
            this.eventsService.set(r)
            this.dialog = false
            this.model = {}
          })
    },
    getData(start, end) {
      http.api.lesson.search(`start>=${this.formatQuery(start)}&end<=${this.formatQuery(end)}`)
          .then(r => {
            this.events = r
            this.eventsService.set(r)
            this.dialog = false
            this.model = {}
          })
    },
    remove() {
      http.api.lesson.delete(this.model.id)
          .then(() => {
            this.getData(this.range.start, this.range.end)
          })
    },
    save() {
      let data = this.model

      if (!!data?.id) {
        http.api.lesson.update(data.id, data)
            .then(r => {
              this.dialog = false
              this.eventsService.update({
                ...data,
                id: r,
                title: `🟡 ${data.student.name} (${data.worker.name})`,
                start: data.start,
                end: data.end,
                location: data.cabinet.name,
              })
            })
      } else {
        http.api.lesson.save(data)
            .then(r => {
              this.dialog = false
              this.eventsService.add({
                ...data,
                id: r,
                title: `🟡 ${data.student.name} (${data.worker.name})`,
                start: data.start,
                end: data.end,
                location: data.cabinet.name,
                calendarId: data.worker.id
              })
            })
      }

    },
    formatDateToString(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Добавляем 1, т.к. месяцы начинаются с 0
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    addTime(dateTime, minutes) {
      let date = new Date(dateTime);
      date.setMinutes(date.getMinutes() + minutes);

      return date
    },
    render() {
      const vm = this;
      const calendar = createCalendar(this.calendar, this.config)

      this.calendar.callbacks.onClickDateTime = (dateTime) => {
        vm.dialog = true
        let roundedDate = new Date(dateTime);
        let minutes = roundedDate.getMinutes();

        if (minutes < 30) roundedDate.setMinutes(0, 0, 0);
        else roundedDate.setMinutes(30, 0, 0);

        let endDate = vm.addTime(roundedDate, 30)

        vm.model = {
          start: vm.formatDateToString(roundedDate),
          end: vm.formatDateToString(endDate)
        }
      };

      this.calendar.callbacks.onEventClick = (item) => {
        this.model = item
        this.dialog = true
      }

      this.calendar.callbacks.onRender = (app) => {
        let range = app.calendarState.range.v;
        vm.range = range
        vm.getData(range.start, range.end)
      }

      this.calendar.callbacks.onRangeUpdate = (range) => {
        vm.range = range
        vm.getData(range.start, range.end)
      }

      calendar.render(document.getElementById('calendar'))
    },
    formatQuery(value) {
      value = value.replaceAll(/ /g, "%20")
      value = encodeURIComponent(value)
      return value
    },
    setupWebSocket() {
      if (!this.$socket) return
      this.$socket.onmessage = (event) => {
        this.eventsService.update(JSON.parse(event.data))
      };
    },
  },
  watch: {
    'model.session'(newVal) {
      if (!!newVal)
        this.model.end = this.formatDateToString(this.addTime(this.model.start, newVal.duration))
    },
    'model.worker'(newVal) {
      // this.model.instrument = null
      if (!!newVal?.instruments && newVal.instruments.length === 1) {
        this.model.instrument = newVal.instruments[0]
      }
    },
    'model.student'(newVal) {
      this.model.child = null
      if (!!newVal?.children && newVal.children.length === 1) {
        this.model.child = newVal.children[0]
      }
    },
  },
  computed: {
    fields() {
      let fields = {
        start: {
          cols: 6,
          label: 'Начало',
          type: Date,
          time: true,
          rules: [this.rules.required],
        },
        end: {
          cols: 6,
          label: 'Конец',
          type: Date,
          time: true,
          rules: [this.rules.required],
        },
        session: {
          label: 'Тип занятия',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.lessonTypes,
          disabled: !this.isAdmin,
          rules: [this.rules.required],
        },
        worker: {
          label: 'Преподаватель',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.workers,
          disabled: !this.isAdmin,
          rules: [this.rules.required],
        },
        instrument: {
          label: 'Инструмент',
          type: Array,
          value: 'id',
          text: 'name',
          disabled: !this.isAdmin,
          items: !!this.model?.worker?.instruments ? this.model.worker.instruments : [],
          rules: [this.rules.required],
        },
        student: {
          label: 'Студент',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.students,
          disabled: !this.isAdmin,
          rules: [this.rules.required],
        },
      }

      if (!!this.model?.student?.children.length) {
        fields = {
          ...fields,
          child: {
            label: 'Ребенок',
            type: Array,
            value: 'id',
            text: 'name',
            disabled: !this.isAdmin,
            items: !!this.model?.student?.children ? this.model.student.children : [],
            rules: [this.rules.required],
          },
        }
      }

      fields = {
        ...fields,
        cabinet: {
          label: 'Кабинет',
          type: Array,
          value: 'id',
          text: 'name',
          items: this.cabinets,
          disabled: !this.isAdmin,
          rules: [this.rules.required],
        },
        cancelLesson: {
          cols: 12
        }
      }

      return fields
    }
  },
  mounted() {
    http.api.user.current()
        .then(r => {
          for (let i = 0; i < r.authRoles.length; i++) {
            for (let j = 0; j < r.authRoles[i].permissions.length; j++) {
              if (r.authRoles[i].permissions[j].name.authority === 'DASHBOARD_ADMIN') {
                this.isAdmin = true
              }
            }
          }
        })

    this.setupWebSocket()

    this.eventsService = createEventsServicePlugin();
    this.config.push(this.eventsService);

    this.calendarControls = createCalendarControlsPlugin();
    this.config.push(this.calendarControls);

    http.api.session.listAll()
        .then(r => {
          this.lessonTypes = r
        })
    http.api.student.listAll()
        .then(r => {
          this.students = r
        })
    http.api.worker.listAll()
        .then(r => {
          this.workers = r
        })
    http.api.cabinet.listAll()
        .then(r => {
          this.cabinets = r
        })
    http.api.worker.getWorkersWithColors()
        .then(r => {
          this.calendarControls.setCalendars(r.workers)
        })
    this.render()
  },
};
</script>
<style>
:root {
  --sx-color-primary: #1d3d90;
  --sx-color-on-primary: #fff;
  --sx-color-primary-container: #dde0ff;
  --sx-color-on-primary-container: #21005e;
  --sx-color-secondary: #625b71;
  --sx-color-on-secondary: #fff;
  --sx-color-secondary-container: #dee3f8;
  --sx-color-on-secondary-container: #1e192b;
  --sx-color-tertiary: #7d5260;
  --sx-color-on-tertiary: #fff;
  --sx-color-tertiary-container: #ffd8e4;
  --sx-color-on-tertiary-container: #370b1e;
  --sx-color-surface: #f7f7ff;
  --sx-color-surface-dim: #d8d9e1;
  --sx-color-surface-bright: #f8f7ff;
  --sx-color-on-surface: #1c1b1f;
  --sx-color-surface-container: #edeef7;
  --sx-color-surface-container-low: #f2f2fa;
  --sx-color-surface-container-high: #ece6f0;
  --sx-color-background: #fff;
  --sx-color-on-background: #1c1b1f;
  --sx-color-outline: #79747e;
  --sx-color-outline-variant: #c4c7c5;
  --sx-color-shadow: #000;
  --sx-color-surface-tint: #1d3d90;
  --sx-color-neutral: var(--sx-color-outline);
  --sx-color-neutral-variant: var(--sx-color-outline-variant);

  --sx-internal-color-gray-ripple-background: #e0e0e0;
  --sx-internal-color-light-gray: #fafafa;
  --sx-internal-color-text: #000;
}
</style>