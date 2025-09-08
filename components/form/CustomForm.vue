<template>
  <v-form
      ref="form"
      v-model="valid"
      :disabled="disabled"
      :readonly="readonly"
      validate-on="input"
      fast-fail
  >
    <v-container :class="dense ? 'ma-0 pa-0' : null" fluid>
      <v-progress-linear :active="loading" indeterminate/>
      <v-row v-show="!loading" :dense="dense">
        <v-col v-for="[key, value] of Object.entries(fields)"
               v-if="!value.hidden"
               class="px-1"
               :key="key"
               :cols="value.cols || (value.lg || value.md || value.sm || value.xl || value.xs ? undefined : 12)"
               :class="colClass"
               :lg="value.lg"
               :md="value.md"
               :sm="value.sm"
               :xl="value.xl"
               :xs="value.xs"
        >

          <slot v-if="!value.type" :name="key" v-bind="{ key: key, item: value } "></slot>
          <v-text-field
              v-else-if="((value.type.name === String.name) && value.area !== true) || value.type.name === Number.name"
              @update:modelValue="setter(key, $event)"
              color="primary"
              :variant="variant"
              :model-value="getter(key)"
              :disabled="value.disabled"
              :readonly="value.readonly"
              :suffix="value.suffix"
              :prefix="value.prefix"
              :hint="value.hint"
              :persistent-hint="value.persistentHint"
              :hide-details="!!value.hideDetails ?  value.hideDetails : false"
              :placeholder="value.placeholder"
              :persistent-placeholder="value.persistentPlaceholder"
              :label="value.label || key"
              :rules="(value.type.name === Number.name ? [ s => !isNaN(s) || 'Числовое поле' ] : []).concat(value.rules || [])"
              :type="!!value.password ? 'password' : (value.type.name === Number.name ? 'number' : 'text')"
              density="default"
          >
            <template
                v-slot:prepend
                class="d-flex align-center justify-center cursor-pointer"
                v-if="!!value.prependOuterIcon"
                @click="callCallback(value.prependOuterIcon)"
            >
              <icon :name="value.prependOuterIcon" width="30" height="30"/>
            </template>
            <template
                v-slot:prepend-inner
                class="d-flex align-center justify-center cursor-pointer"
                v-if="!!value.prependIcon"
                @click="callCallback(value.prepend)"
            >
              <icon :name="value.prependIcon" width="30" height="30"/>
            </template>
            <template
                v-slot:append
                class="d-flex align-center justify-center cursor-pointer"
                v-if="!!value.appendOuterIcon"
                @click="callCallback(value.appendOuter)"
            >
              <icon :name="value.appendOuterIcon" width="30" height="30"/>
            </template>
            <template
                v-slot:append-inner
                class="d-flex align-center justify-center cursor-pointer"
                v-if="!!value.appendIcon"
                @click="callCallback(value.append)"
            >
              <icon :name="value.appendIcon" width="30" height="30"/>
            </template>
          </v-text-field>
          <v-autocomplete
              outlined
              v-show="!!value.hide ? !value.hide : true"
              v-else-if="value.type.name === Array.name"
              :model-value="getter(key)"
              @update:modelValue="setter(key, $event)"
              :variant="variant"
              :item-title="value.text"
              :item-value="value.value"
              :items="value.items"
              :disabled="value.disabled"
              :readonly="value.readonly"
              :chips="value.multiple"
              :clearable="!value.readonly && value.clearable !== false"
              :deletable-chips="value.multiple"
              :dense="dense"
              :hint="value.hint"
              :label="value.label || key"
              :multiple="value.multiple"
              :hide-details="!!value.hideDetails ?  value.hideDetails : false"
              :persistent-hint="value.persistentHint"
              :return-object="value.returnObject === undefined || value.returnObject"
              :rules="value.rules"
              :append-icon="value.appendIcon"
              :append-outer-icon="value.appendOuterIcon"
              :prepend-icon="value.prependIcon"
              :prepend-inner-icon="value.prependInnerIcon"
              @click:append="callCallback(value.append)"
              @click:append-outer="callCallback(value.appendOuter)"
              @click:prepend="callCallback(value.prepend)"
              @click:prepend-inner="callCallback(value.prependInner)"
              no-data-text="Нет данных"
              :small-chips="value.multiple"
              :search-input.sync="syncSearch[key]"
              color="primary"
          >
          </v-autocomplete>
          <v-switch v-else-if="value.type.name === Boolean.name"
                    :label="value.label || key"
                    :model-value="getter(key)"
                    @update:modelValue="setter(key, $event)"
                    inset
                    color="primary"
          />
          <v-text-field
              v-else-if="value.type.name === Date.name && !!value.time"
              type="datetime-local"
              color="primary"
              persistent-placeholder
              pattern="^(20\\d{2}|19\\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])T([01]\\d|2[0-3]):[0-5]\\d$"
              outlined
              flat
              :variant="variant"
              :model-value="getter(key)"
              @update:modelValue="setter(key, $event)"
              :disabled="value.disabled"
              :readonly="value.readonly"
              :dense="dense"
              :label="value.label || key"
              :rules="!getter(key) ? [] : value.rules"
              :hide-details="!!value.hideDetails ? value.hideDetails : false"
          />
          <v-text-field
              v-else-if="value.type.name === Date.name && !value.time"
              type="date"
              color="primary"
              persistent-placeholder
              pattern="^(20\d{2}|19\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d$"
              outlined flat
              :variant="variant"
              :model-value="getter(key)"
              @update:modelValue="setter(key, $event)"
              :disabled="value.disabled"
              :readonly="value.readonly"
              :dense="dense"
              :label="value.label || key"
              :rules="!getter(key) ? [] :value.rules"
              :hide-details="!!value.hideDetails ?  value.hideDetails : false"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <slot name="action"/>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "CustomForm",
  components: {},
  props: {
    value: {type: Boolean, default: false},
    colClass: {type: String, default: "d-flex align-center"},
    model: {type: Object},
    fields: {type: Object, required: true},
    disabled: {type: Boolean, default: false},
    readonly: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    dense: {type: Boolean, default: true}
  },
  data: () => {
    return {
      datePikers: {},
      syncSearch: {},
      date: {},
      firstName: '',
      variant: 'outlined'
    }
  },
  methods: {
    callCallback(callback) {
      callback?.()
    },
    isValidDate(value) {
      // Проверяем, что строка в формате "yyyy-MM-ddTHH:mm" или "yyyy-MM-ddTHH:mm:ss"
      const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
      return isoDateTimePattern.test(value) && !isNaN(Date.parse(value));
    },
    setter(path, value) {
      if (this.isValidDate(value)) {
        value = value.replace('T', ' ');
      }

      const topObj = this.formModel;
      let obj = topObj;
      let subPathes = path.split('.');
      let subPath = subPathes[0]
      for (let i = 0; i < subPathes.length; i++) {
        subPath = subPathes[i];
        let subObj = obj[subPath]
        if (!subObj) {
          subObj = obj[subPath] = {}
        }
        if (i < subPathes.length - 1) {
          obj = subObj
        }
      }
      obj[subPath] = value;
      this.formModel = {...topObj}
    }
  },
  computed: {
    valid: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    formModel: {
      get() {
        return this.model || {}
      },
      set(value) {
        this.$emit('update:model', value)
      }
    },
    getter() {
      return path => {
        let obj = this.formModel
        if (!obj) return;

        for (let subPath of path.split('.')) {
          const subObj = obj[subPath]
          if (subObj === null || subObj === undefined) { // не делать !subObj
            return;
          }
          obj = subObj
        }
        return obj
      }
    },
  },
  created() {
    let fields = Object.entries(this.fields)
    for (let i = 0; i < fields.length; i++) {
      if (fields[i][1].type === Array) {
        this.syncSearch[fields[i][0]] = null
      }
    }
  }

}
</script>

<style>
.cursor-pointer {
  cursor: wait !important;
}
</style>