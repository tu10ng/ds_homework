CFLAGS += -Wall -Werror

.PHONY: app clean run

app: front end

front: 


end: end.c
	gcc $(CFLAGS) -o end end.c

run: app
	@./end > tmp.txt
	@cat tmp.txt

clean: 
	-rm end tmp.txt
